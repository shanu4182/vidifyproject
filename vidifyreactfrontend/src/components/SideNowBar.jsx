import React from "react";
import { IoHome } from "react-icons/io5";
import { GiFire, GiMusicSpell, GiFilmProjector, GiSportMedal, GiBookCover, GiCookingPot, GiPodium, GiHorror, GiGlobe, GiBrain,GiMeditation } from "react-icons/gi";
import { FaGamepad, FaRegLaugh, FaPaintBrush, FaChalkboardTeacher, FaTheaterMasks, FaPodcast, FaMicroscope, FaRegNewspaper ,FaSkull} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiAddFill, RiMeditationLine } from "react-icons/ri";
import { PiFilmReelFill } from "react-icons/pi";
import { MdOutlineFitnessCenter, MdTravelExplore, MdOutlinePhotoCamera } from "react-icons/md";
import { BsFillFileEarmarkPlayFill, BsFillCameraVideoFill } from "react-icons/bs";
import { IoBodyOutline } from "react-icons/io5";
import { BiNews, BiHealth } from "react-icons/bi";
import { ImBooks } from "react-icons/im";
import { AiOutlineRobot } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";

function SideNowBar() {
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: <IoHome size={20} />,
      name: "Home",
      link: "/getHomeVideos",
    },
    {
      icon: <GiFire size={20} />,
      name: "Trending",
      link: "/trending",
    },
    {
      icon: <GiFilmProjector size={20} />,
      name: "Movies",
      link: "/Movies",
    },
    {
      icon: <PiFilmReelFill size={20} />,
      name: " Shorts",
      link: "/Shorts",
    },
    {
      icon: <FaPlusCircle size={20} />,
      name: "New",
      link: "/new",
    },
  ];

  const categoryItems = [
    {
      icon: <GiMusicSpell size={20} />,
      name: "Music",
      link: "/videosByCategories/music",
    },
    {
      icon: <FaGamepad size={20} />,
      name: "Gaming",
      link: "/videosByCategories/gaming",
    },
    {
      icon: <FaRegLaugh size={20} />,
      name: "Comedy",
      link: "/videosByCategories/comedy",
    },
    {
      icon: <GiSportMedal size={20} />,
      name: "Sports",
      link: "/videosByCategories/sports",
    },
    {
      icon: <GiBookCover size={20} />,
      name: "Education",
      link: "/videosByCategories/education",
    },
    {
      icon: <GiCookingPot size={20} />,
      name: "Cooking",
      link: "/videosByCategories/cooking",
    },
    {
      icon: <MdOutlineFitnessCenter size={20} />,
      name: "Fitness",
      link: "/videosByCategories/fitness",
    },
    {
      icon: <FaPaintBrush size={20} />,
      name: "Art",
      link: "/videosByCategories/art",
    },
    {
      icon: <FaChalkboardTeacher size={20} />,
      name: "Tutorials",
      link: "/videosByCategories/tutorials",
    },
    {
      icon: <GiPodium size={20} />,
      name: "Podcasts",
      link: "/videosByCategories/podcasts",
    },
    {
      icon: <FaTheaterMasks size={20} />,
      name: "Drama",
      link: "/videosByCategories/drama",
    },
    {
      icon: <FaSkull size={20} />,
      name: "Horror",
      link: "/videosByCategories/horror",
    },
    {
      icon: <GiGlobe size={20} />,
      name: "Travel",
      link: "/videosByCategories/travel",
    },
    {
      icon: <MdOutlinePhotoCamera size={20} />,
      name: "Photography",
      link: "/videosByCategories/photography",
    },
    {
      icon: <GiMeditation size={20} />,
      name: "Meditation",
      link: "/videosByCategories/meditation",
    },
    {
      icon: <BsFillFileEarmarkPlayFill size={20} />,
      name: "Unboxing",
      link: "/videosByCategories/unboxing",
    },
    {
      icon: <GiBrain size={20} />,
      name: "Science",
      link: "/videosByCategories/science",
    },
    {
      icon: <BiNews size={20} />,
      name: "News",
      link: "/videosByCategories/news",
    },
    {
      icon: <ImBooks size={20} />,
      name: "Books",
      link: "/videosByCategories/books",
    },
    {
      icon: <AiOutlineRobot size={20} />,
      name: "Tech",
      link: "/videosByCategories/tech",
    },
    {
      icon: <FaPodcast size={20} />,
      name: "Podcasts",
      link: "/videosByCategories/podcasts",
    },
    {
      icon: <BsFillCameraVideoFill size={20} />,
      name: "Documentaries",
      link: "/videosByCategories/documentaries",
    },
    {
      icon: <FaMicroscope size={20} />,
      name: "Biology",
      link: "/videosByCategories/biology",
    },
    {
      icon: <IoBodyOutline size={20} />,
      name: "Health",
      link: "/videosByCategories/health",
    },
    {
      icon: <GiFilmProjector size={20} />,
      name: "Animation",
      link: "/videosByCategories/animation",
    },
    {
      icon: <FaPodcast size={20} />,
      name: "ASMR",
      link: "/videosByCategories/asmr",
    },
    {
      icon: <BiHealth size={20} />,
      name: "Lifestyle",
      link: "/videosByCategories/lifestyle",
    },
    {
      icon: <MdTravelExplore size={20} />,
      name: "Adventure",
      link: "/videosByCategories/adventure",
    },
    {
      icon: <FaRegNewspaper size={20} />,
      name: "Reviews",
      link: "/videosByCategories/reviews",
    },
  ];

  function NavItem({ icon, name, link }) {
    return (
      <div className="nav-icon-content" onClick={() => navigate(link)}>
        <span className="nav-icon">{icon}</span>
        <span className="nav-icon-name">{name}</span>
      </div>
    );
  }

  return (
    <aside className="side-now-bar">
      {menuItems.map((item, index) => (
        <NavItem key={index} icon={item.icon} name={item.name} link={item.link} />
      ))}

      <hr />

      {categoryItems.map((item, index) => (
        <NavItem key={index} icon={item.icon} name={item.name} link={item.link} />
      ))}
    </aside>
  );
}

export default SideNowBar;
