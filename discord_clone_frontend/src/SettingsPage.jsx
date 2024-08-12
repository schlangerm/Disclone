import { useState } from 'react';

import LeftNavbar from './components/LeftNavbar';
import MainBody from './MainBody';
import ProfileSettings from './settings/ProfileSettings';

import './css/globals.css';
import './css/settings_page.css';

const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  const settingsArray = [
    { id: 1, type: 'Settings', name: 'Profile', component: ProfileSettings }
  ];

  const onSelectSetting = async (setting) => {
      console.log(`selected setting: ${setting}`);
      setActiveSetting(setting)
  }

  return (
    <div className='settings-page'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LeftNavbar 
          contentArray={settingsArray}  
          onSelectElement={onSelectSetting} />
      )}
      {activeSetting ? <MainBody activeElement={activeSetting} /> : 
      <div className='no-selection-message'>
        <p>Select a setting</p>
      </div>}
    </div>
  );
};

export default SettingsPage;