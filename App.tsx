import React, { useState, useEffect } from 'react';
import { LaserType, LaserConfig, JobSettings, Project, CalculationResult, CloudConfig } from './types';
import { calculateLaserSettings } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import JobPanel from './components/JobPanel';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryList from './components/HistoryList';
import HomeView from './components/HomeView';
import EconomicsCalculator from './components/EconomicsCalculator';
import SettingsView from './components/SettingsView';

export type AppView = 'home' | 'calculator' | 'economics' | 'history' | 'settings';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppView>('home');
  const [laserConfig, setLaserConfig] = useState<LaserConfig>({
    type: LaserType.DIODE,
    wattage: 10,
    brand: '',
    lensSize: 50.8
  });
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    googleSheetsApiKey: '',
    spreadsheetId: ''
  });
  const [jobSettings, setJobSettings] = useState<JobSettings>({
    material: 'Plywood',
    thickness: 3,
    operation: 'cut',
    materialItems: [{ id: generateUUID(), name: 'Base Material', cost: 0 }],
    hourlyRate: 50
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AppView;
      const validTabs: AppView[] = ['home', 'calculator', 'economics', 'history', 'settings'];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (e) {
      setActiveTab('home');
    }
  }, []);

  useEffect(() => {
    const savedProjects = localStorage.getItem('beammaster_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    const savedCloud = localStorage.getItem('beammaster_cloud_config');
    if (savedCloud) setCloudConfig(JSON.parse(savedCloud));
    const savedJob = localStorage.getItem('beammaster_job_settings');
    if (savedJob) setJobSettings(JSON.parse(savedJob));
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const calcResult = await calculateLaserSettings(laserConfig, jobSettings);
      const timeMatch = calcResult.estimatedTime.match(/(\d+)m/);
      const minutes = timeMatch ? parseInt(timeMatch[1]) : 5;
      const materialTotal = jobSettings.materialItems.reduce((acc, item) => acc + item.cost, 0);
      const machineTotal = (minutes / 60) * (jobSettings.hourlyRate || 0);
      const totalCost = machineTotal + materialTotal;
      
      const enrichedResult = { ...calcResult, totalCost, suggestedPrice: totalCost * 2.5 };
      setResult(enrichedResult);
      
      const newProject: Project = {
        id: generateUUID(),
        date: new Date().toISOString(),
        ...jobSettings,
        laserConfig,
        results: enrichedResult
      };
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('beammaster_projects', JSON.stringify(updatedProjects));
    } catch (error: any) {
      alert(error.message || "Failed to calculate settings.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('beammaster_projects', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-slate-950 text-slate-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-grow flex flex-col p-4 md:p-12 pb-32 md:pb-12 bg-slate-950 overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto w-full flex-grow flex flex-col">
          {activeTab !== 'home' && (
            <Header title={
              activeTab === 'calculator' ? 'Project Setup' : 
              activeTab === 'economics' ? 'Pricing Tools' : 
              activeTab === 'history' ? 'History' : 'Settings'
            } />
          )}
          
          <div className="flex-grow">
            {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}

            {activeTab === 'calculator' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="space-y-8">
                  <ConfigPanel config={laserConfig} onChange={setLaserConfig} />
                  <JobPanel settings={jobSettings} onChange={setJobSettings} onCalculate={handleCalculate} loading={loading} />
                </div>
                <div className="relative">
                  <ResultsDisplay result={result} loading={loading} job={jobSettings} />
                </div>
              </div>
            )}

            {activeTab === 'economics' && (
              <EconomicsCalculator 
                settings={jobSettings} 
                onChange={setJobSettings} 
                projects={projects} 
                cloudConfig={cloudConfig}
                currentResult={result}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'history' && <HistoryList projects={projects} onDelete={deleteProject} />}
            {activeTab === 'settings' && <SettingsView config={cloudConfig} onSave={setCloudConfig} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;