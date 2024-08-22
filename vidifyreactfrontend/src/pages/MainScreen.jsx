import React, { useState } from "react";
import Header from "../components/Header";
import SideNowBar from "../components/SideNowBar";
import { Route, Routes } from "react-router-dom";
import HomeScreen from "./HomePage/HomeScreen";
import NotificationScreen from "./Notification/Notification";
import ProfileScreen from "./Profile/Profile";
import CategoryVideoScreen from "./CategoryVideosPage/CategoryVideoScreen";
import UploadScreen from "./UplodForm/UploadScreen";
import MovieScreen from "./MoviePage/MovieScreen";
import ShortScreen from "./ShortsPage/ShortScreen";

function MainScreen() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  return (
    <>
      <Header  isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
      <main className="main">
        {isSideBarOpen && <SideNowBar />}
        <section className="mainContainer">
          <Routes>
            <Route path="/*" element={<HomeScreen />} />
            <Route path="notifications" element={<NotificationScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="/videosByCategories/:category" element={<CategoryVideoScreen />} />
            <Route path="new" element={<UploadScreen />} />
            <Route path="Movies" element={<MovieScreen/>} />
            <Route path="Shorts" element={<ShortScreen/>} />
          </Routes>
        </section>
      </main>
    </>
  );
}
export default MainScreen