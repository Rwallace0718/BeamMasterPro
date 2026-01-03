
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
import SplashScreen from './components/SplashScreen';

export type AppView = 'home' | 'calculator' | 'economics' | 'history' | 'settings';

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
    materialItems: [{ id: '1', name: 'Base Material', cost: 0 }],
    hourlyRate: 50
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('beammaster_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    const savedCloud = localStorage.getItem('beammaster_cloud_config');
    if (savedCloud) {
      setCloudConfig(JSON.parse(savedCloud));
    }
    const savedJob = localStorage.getItem('beammaster_job_settings');
    if (savedJob) {
      setJobSettings(JSON.parse(savedJob));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('beammaster_job_settings', JSON.stringify(jobSettings));
  }, [jobSettings]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const calcResult = await calculateLaserSettings(laserConfig, jobSettings);
      
      const timeMatch = calcResult.estimatedTime.match(/(\d+)m/);
      const minutes = timeMatch ? parseInt(timeMatch[1]) : 5;
      
      const materialTotal = jobSettings.materialItems.reduce((acc, item) => acc + item.cost, 0);
      const machineTotal = (minutes / 60) * (jobSettings.hourlyRate || 0);
      const totalCost = machineTotal + materialTotal;
      
      const enrichedResult = {
        ...calcResult,
        totalCost,
        suggestedPrice: totalCost * 2.5 
      };

      setResult(enrichedResult);
      
      const newProject: Project = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        ...jobSettings,
        laserConfig,
        results: enrichedResult
      };
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('beammaster_projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error("Calculation failed", error);
      alert("Failed to calculate settings.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('beammaster_projects', JSON.stringify(updated));
  };

  const saveCloudConfig = (config: CloudConfig) => {
    setCloudConfig(config);
    localStorage.setItem('beammaster_cloud_config', JSON.stringify(config));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SplashScreen />
      
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {activeTab !== 'home' && <Header />}
        
        {activeTab === 'home' && (
          <HomeView onNavigate={setActiveTab} />
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ConfigPanel config={laserConfig} onChange={setLaserConfig} />
                <JobPanel settings={jobSettings} onChange={setJobSettings} onCalculate={handleCalculate} loading={loading} />
              </div>
              <div className="sticky top-8">
                <ResultsDisplay result={result} loading={loading} job={jobSettings} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economics' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <EconomicsCalculator 
              settings={jobSettings} 
              onChange={setJobSettings} 
              projects={projects} 
              cloudConfig={cloudConfig}
              currentResult={result}
              onNavigate={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <HistoryList projects={projects} onDelete={deleteProject} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <SettingsView config={cloudConfig} onSave={saveCloudConfig} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
