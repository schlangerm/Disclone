// Delete user
// Change Display Name

import { useState } from "react";
import LeftNavbar from "./LeftNavbar";
import MainBody from "./MainBody";
import TopNavbar from "./TopNavbar";
import ProfileSettings from "./settings/ProfileSettings";


const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  const settingsArray = [
    { id: 1, type: 'Settings', name: 'Profile', component: ProfileSettings }
  ];



  const onSelectSetting = async (setting) => {
      console.log("selected setting: ", setting);
      setActiveSetting(setting)
  }


  return (
    <div className="settings-page">
      <TopNavbar/>
      <div className='main-content-wrapper'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <LeftNavbar 
            contentArray={settingsArray}  
            onSelectElement={onSelectSetting} />
        )}
        {activeSetting ? <MainBody activeElement={activeSetting} /> : <p>Select a setting</p>}
      </div>
    </div>
  );
};

export default SettingsPage;