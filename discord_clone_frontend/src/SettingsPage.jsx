// Delete user
// Change Display Name

import { useState } from "react";
import LeftNavbar from "./LeftNavbar";
import MainBody from "./MainBody";
import TopNavbar from "./TopNavbar";


const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  //mock settings array for expansion later
  const settingsArray = [
    {
    type: "Settings",
    id: "1",
    name: "Profile"
    }
  ]



  const onSelectSetting = async (setting) => {
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
        {activeSetting && <MainBody activeElement={activeSetting} />}
      </div>
    </div>
  );
};

export default SettingsPage;