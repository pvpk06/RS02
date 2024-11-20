import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import './HR_Dash.css';
import RSLogo from './RSLogo.jpeg';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import HrPortal from './Home/HrDashboard';
import { Dropdown } from 'react-bootstrap';
import JobApplicationsTable from './Home/StudentsApplied'
import StudentsPlaced from './Home/StudentsPlaced';
import JobStatus from '../JobStatus/JobStatus';
import HrJobDesc from '../HrViewJobs/HrJobDesc';
import StudentDetails from './Home/StudentData';
import CompanyData from './Home/CompanyData';
import HrPostJobs from '../HrPostJobs/HrPostJobs';
import HrLMSDash from '../LMS/HrLMSDash';
import RegistrationRequests from '../Intern_Requests/RegistrationRequests';
import ProfilePage from '../HrProfile/HrProfile';
import HrViewJobs from '../HrViewJobs/HrViewJobs';
import HrLeads from '../JobStatus/HrLeads';
import CertificateGenerator from '../Certificate/certificate';
import QuizDash from '../Quiz/quiz/quizdash';
import CreateDash from '../Quiz/quiz/QuizCreate/CreateDash';
import GuestRegistrationRequests from '../Intern_Requests/guestRequests';
import OfferLetter from '../Offer_Letter/offerLetter'
import PreviewQuiz from '../Quiz/quiz/preview/preview';
import InternBulkRegister from '../BulkRegister/InternBulkUpload';
import GuestBulkRegister from '../BulkRegister/GuestBulkUpload';

const HRDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedView, setSelectedView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});

  const { '*': currentPath } = useParams();
  const name = Cookies.get('name');

  const menuItems = [
    { id: 'home', name: 'Dashboard', icon: 'fas fa-home' },
    {
      id: 'jobGallery', name: 'Jobs Gallery', icon: 'fas fa-list',
      submenu: [
        { id: 'postjob', name: 'Post a Job', icon: 'fas fa-plus' },
        { id: 'jobs', name: 'All Jobs', icon: 'fas fa-list' },
        { id: 'companies', name: 'Companies', icon: 'fas fa-caret-square-right' },
      ]
    },
    { id: 'lms', name: 'LMS', icon: 'fas fa-book' },
    { id: 'quiz', name: 'Quiz', icon: 'fa-solid fa-list-check' },
    { id: 'internRequests', name: 'Intern Requests', icon: 'fa fa-user-plus' },
    { id: 'guestRequests', name: 'Guest Requests', icon: 'fa fa-user-plus' },
    { id: 'internshipCertificate', name: 'Certificate', icon: 'fa fa-file-alt' },
    { id: 'offerLetter', name: 'Offer Letter', icon: 'fas fa-sticky-note' },
	      {
      id: 'bulkRegister', name: 'Bulk Register', icon: 'fas fa-file-export',
      submenu: [
        { id: 'bulkIntern', name: 'Interns', icon: 'fas fa-file-export' },
        { id: 'bulkGuest', name: 'Guests', icon: 'fas fa-file-export' },
      ]
    },
    { id: 'profile', name: 'Profile', icon: 'fa fa-user' },
  ];

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2) {
      const view = pathParts[2];
      setSelectedView(view);
    }
  }, [location]);

  const handleMenuItemClick = (id) => {
    setSelectedView(id);
    navigate(`/HR_dash/${id}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const logout = () => {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName);
    });

    navigate("/")
  }

  const renderMenuItem = (item) => (
    <li key={item.id} className="menu-item-container">
      <div
        className={`menu-item ${selectedView === item.id ? 'active' : ''}`}
        onClick={() => item.submenu ? toggleSubmenu(item.id) : handleMenuItemClick(item.id)}
      >
        <i className={item.icon}></i>
        {isSidebarOpen && <span>{item.name}</span>}
        {item.submenu && isSidebarOpen && (
          <i className={`submenu-toggle fas ${expandedMenus[item.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        )}
      </div>
      {item.submenu && expandedMenus[item.id] && (
        <ul className="submenu">
          {item.submenu.map(subItem => (
            <li
              key={subItem.id}
              className={`submenu-item ${selectedView === subItem.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(subItem.id)}
            >
              <i className={subItem.icon}></i>
              {isSidebarOpen && subItem.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  const renderContent = () => {

    if (currentPath.startsWith('job_desc/')) {
      const jobId = currentPath.split('/')[1];
      return <HrJobDesc jobId={jobId} setSelectedView={setSelectedView} />;
    }


    if (currentPath.startsWith('student/')) {
      const candidateID = currentPath.split('/')[1];
      console.log("candidateID", candidateID);
      return (
        <StudentDetails candidateID={candidateID} />
      );
    }

    if (currentPath.startsWith('preview/')) {
      const token = currentPath.split('/')[1];
      console.log(token);
      return (
        <PreviewQuiz token={token} />
      );
    }

    if (currentPath.startsWith('edit/')) {
      const defaultTab = currentPath.split('/')[1];
      const token = currentPath.split('/')[2];
      console.log("Default tab, token :", defaultTab, token);
      return <CreateDash defaultTab={defaultTab} token={token} />;
    }


    if (currentPath.startsWith('companies/')) {
      const companyID = currentPath.split('/')[1];
      return <CompanyData companyID={companyID} />;
    }

    const statusMapping = {
      "students-qualified": "qualified",
            "students-not-qualified": "not-qualified",
      "students-placed": "placed",
      "students-not-placed": "not-placed",
      "not-attended": "not-attended",
      "under-progress": "under-progress",
      "interns-not-interested": "not-interested",
      "not-eligible": "not-eligible",
      "eligible": "eligible",
      "level-1": "level-1",
      "level-2": "level-2",
      "level-3": "level-3",
    };

    switch (selectedView) {

      case 'lms':
        return <HrLMSDash />

      case 'quiz':
        return <QuizDash />

      case 'internRequests':
        return <RegistrationRequests />;

      case 'guestRequests':
        return <GuestRegistrationRequests />

      case 'postjob':
        return <HrPostJobs />;

      case 'jobs':
        return <HrViewJobs />;

      case 'companies':
        return <HrLeads />

      case 'internshipCertificate':
        return <CertificateGenerator />

      case 'offerLetter':
        return <OfferLetter />

      case 'bulkIntern':
        return <InternBulkRegister />
      case 'bulkGuest':
        return <GuestBulkRegister />


      case 'profile':
        return <ProfilePage />

      case "students-applied":
        return <JobApplicationsTable />

      case "students-qualified":
	    case "students-not-qualified":
      case "students-placed":
      case "students-not-placed":
      case "not-attended":
      case "interns-not-interested":
      case "not-eligible":
      case "under-progress":
      case "eligible":
      case 'level-1':
      case 'level-2':
      case 'level-3':
        return <StudentsPlaced status={statusMapping[selectedView]} />;

      case "hr-leads":
        return <HrLeads />
      case "all-jobs":
        return <JobStatus statusInfo="all-jobs" />;
      case "jd-received":
        return <JobStatus statusInfo="jd-received" />;
      case "profiles-sent":
        return <JobStatus statusInfo="profiles-sent" />;
      case "drive-scheduled":
        return <JobStatus statusInfo="drive-scheduled" />;
      case "drive-done":
        return <JobStatus statusInfo="drive-done" />;
      case "not-interested":
        return <JobStatus statusInfo="not-interested" />;
      case 'dashboard':
        return <HrPortal />


      default:
        return <HrPortal />;
    }
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className={`SA_side-nav ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">
          {isSidebarOpen ? <img className="logo-img" src={RSLogo} alt='text' /> : ''}
        </div>
        <button className="SA-toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
        <div className='icons-container'>
          <ul>
            {menuItems.map(renderMenuItem)}
          </ul>
        </div>
      </nav>
      <div className={`main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="top-panel">
          <div className="pvpk">
            <Dropdown.Item className="btn bg-transparent logout-btn fw-bold w-100 pt-0" style={{cursor:"auto"}}>
              {name}
            </Dropdown.Item>
            <button
              onClick={logout}
              className="btn bg-transparent logout-btn fw-bold w-100 pt-0"
              style={{ color: 'white' }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>

        {renderContent()}
        <Outlet />
      </div>
    </div>
  );
};

export default HRDash;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
// import './HR_Dash.css';
// import RSLogo from './RSLogo.jpeg';
// import Cookies from 'js-cookie';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
// import HrPortal from './Home/HrDashboard';
// import { Dropdown } from 'react-bootstrap';
// import JobApplicationsTable from './Home/StudentsApplied'
// import StudentsPlaced from './Home/StudentsPlaced';
// import JobStatus from '../JobStatus/JobStatus';
// import HrJobDesc from '../HrViewJobs/HrJobDesc';
// import StudentDetails from './Home/StudentData';
// import CompanyData from './Home/CompanyData';
// import HrPostJobs from '../HrPostJobs/HrPostJobs';
// import HrLMSDash from '../LMS/HrLMSDash';
// import RegistrationRequests from '../Intern_Requests/RegistrationRequests';
// import ProfilePage from '../HrProfile/HrProfile';
// import HrViewJobs from '../HrViewJobs/HrViewJobs';
// import HrLeads from '../JobStatus/HrLeads';
// import CertificateGenerator from '../Certificate/certificate';
// import QuizDash from '../Quiz/quiz/quizdash';
// import CreateDash from '../Quiz/quiz/QuizCreate/CreateDash';
// import GuestRegistrationRequests from '../Intern_Requests/guestRequests';
// import OfferLetter from '../Offer_Letter/offerLetter'
// import PreviewQuiz from '../Quiz/quiz/preview/preview';
// import InternBulkRegister from '../BulkRegister/InternBulkUpload';
// import GuestBulkRegister from '../BulkRegister/GuestBulkUpload';
// import apiService from '../../../apiService';

// const HRDash = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedView, setSelectedView] = useState('home');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [accessibleMenuItems, setAccessibleMenuItems] = useState([]);
//   const { '*': currentPath } = useParams();
//   const name = Cookies.get('name');
//   const HRid = Cookies.get('HRid');

//   const menuItems = [
//     { id: 'home', name: 'Dashboard', icon: 'fas fa-home' },
//     {
//       id: 'jobGallery', name: 'Jobs Gallery', icon: 'fas fa-list',
//       submenu: [
//         { id: 'postjob', name: 'Post a Job', icon: 'fas fa-plus' },
//         { id: 'jobs', name: 'All Jobs', icon: 'fas fa-list' },
//         { id: 'companies', name: 'Companies', icon: 'fas fa-envelope' },
//       ]
//     },
//     { id: 'lms', name: 'LMS', icon: 'fas fa-book' },
//     { id: 'quiz', name: 'Quiz', icon: 'fa-solid fa-list-check' },
//     { id: 'internRequests', name: 'Intern Requests', icon: 'fa fa-file' },
//     { id: 'guestRequests', name: 'Guest Requests', icon: 'fa fa-file' },
//     { id: 'internshipCertificate', name: 'Certificate', icon: 'fa fa-file' },
//     { id: 'offerLetter', name: 'Offer Letter', icon: 'fa fa-file' },
//     {
//       id: 'bulkRegister', name: 'Bulk Register', icon: 'fas fa-list',
//       submenu: [
//         { id: 'bulkIntern', name: 'Interns', icon: 'fas fa-plus' },
//         { id: 'bulkGuest', name: 'Guests', icon: 'fas fa-list' },
//       ]
//     },
//     { id: 'profile', name: 'Profile', icon: 'fa fa-user' },
//   ];


//   const isMenuItemAccessible = (item) => {
//     if (accessibleMenuItems.includes(item.id)) {
//       return true;
//     }
//     if (item.submenu) {
//       return item.submenu.some(subItem => accessibleMenuItems.includes(subItem.id));
//     }
//     return false;
//   };


//   const isSpecialRouteAccessible = (path) => {
//     // Map special routes to their parent permissions
//     if (path.startsWith('job_desc/')) {
//       return accessibleMenuItems.includes('jobs'); // Need access to 'All Jobs'
//     }
//     if (path.startsWith('student/')) {
//       // Student details should be accessible if user has access to any student-related features
//       return accessibleMenuItems.some(item => 
//         ['students-applied', 'students-qualified', 'students-not-qualified', 
//          'students-placed', 'students-not-placed'].includes(item)
//       ); 
//     }
//     if (path.startsWith('preview/') || path.startsWith('edit/')) {
//       return accessibleMenuItems.includes('quiz'); // Need access to Quiz management
//     }
//     if (path.startsWith('companies/')) {
//       return accessibleMenuItems.includes('companies'); // Need access to Companies
//     }
//     return false;
//   };

//   const isSubmenuItemAccessible = (subItem) => {
//     return accessibleMenuItems.includes(subItem.id);
//   };


//   useEffect(() => {
//     const fetchAccessibleMenus = async () => {
//       try {
//         const response = await apiService.get(`/api/hr_access/${HRid}`);
//         setAccessibleMenuItems(response.data.access);
//       } catch (error) {
//         console.error("Failed to fetch accessible menus:", error);
//       }
//     };
//     fetchAccessibleMenus();
//   }, [HRid]);


//   const getAllMenuIds = (items) => {
//     return items.reduce((acc, item) => {
//       if (item.submenu) {
//         return [...acc, item.id, ...item.submenu.map(sub => sub.id)];
//       }
//       return [...acc, item.id];
//     }, []);
//   };



//   // useEffect(() => {
//   //   const currentRoute = location.pathname.split('/')[2] || 'home';
//   //   const isCurrentRouteAccessible = menuItems.some(item => {
//   //     if (item.id === currentRoute && accessibleMenuItems.includes(item.id)) {
//   //       return true;
//   //     }
//   //     if (item.submenu) {
//   //       return item.submenu.some(subItem => 
//   //         subItem.id === currentRoute && accessibleMenuItems.includes(subItem.id)
//   //       );
//   //     }
//   //     return false;
//   //   });

//   //   if (!isCurrentRouteAccessible && currentRoute !== 'home') {
//   //     navigate('/HR_dash/home');
//   //   }
//   // }, [accessibleMenuItems, location.pathname, navigate]);

    
//     // Updated route protection effect
//     useEffect(() => {
//       const pathParts = location.pathname.split('/');
//       const currentRoute = pathParts[2] || 'home';
  
//       // First check if it's a special route
//       if (currentRoute && (
//         currentRoute.startsWith('job_desc') ||
//         currentRoute.startsWith('student') ||
//         currentRoute.startsWith('preview') ||
//         currentRoute.startsWith('edit') ||
//         currentRoute.startsWith('companies')
//       )) {
//         if (!isSpecialRouteAccessible(currentRoute)) {
//           navigate('/HR_dash/home');
//         }
//         return;
//       }
  
//       // Then check regular routes
//       const isCurrentRouteAccessible = menuItems.some(item => {
//         if (item.id === currentRoute && accessibleMenuItems.includes(item.id)) {
//           return true;
//         }
//         if (item.submenu) {
//           return item.submenu.some(subItem => 
//             subItem.id === currentRoute && accessibleMenuItems.includes(subItem.id)
//           );
//         }
//         return false;
//       });
  
//       if (!isCurrentRouteAccessible && currentRoute !== 'home') {
//         navigate('/HR_dash/home');
//       }
//     }, [accessibleMenuItems, location.pathname, navigate]);
  

//   // const filteredMenuItems = menuItems.filter(item =>
//   //   accessibleMenuItems.includes(item.id) || 
//   //   (item.submenu && item.submenu.some(subItem => accessibleMenuItems.includes(subItem.id)))
//   // );

//   // useEffect(() => {
//   //   const pathParts = location.pathname.split('/');
//   //   if (pathParts.length > 2) {
//   //     const view = pathParts[2];
//   //     setSelectedView(view);
//   //   }
//   // }, [location]);

//   const handleMenuItemClick = (id) => {
//     setSelectedView(id);
//     navigate(`/HR_dash/${id}`);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };


//   const toggleSubmenu = (id) => {
//     setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const logout = () => {
//     Object.keys(Cookies.get()).forEach(cookieName => {
//       Cookies.remove(cookieName);
//     });

//     navigate("/")
//   }

//   // const renderMenuItem = (item) => (
//   //   <li key={item.id} className="menu-item-container">
//   //     <div
//   //       className={`menu-item ${selectedView === item.id ? 'active' : ''}`}
//   //       onClick={() => item.submenu ? toggleSubmenu(item.id) : handleMenuItemClick(item.id)}
//   //     >
//   //       <i className={item.icon}></i>
//   //       {isSidebarOpen && <span>{item.name}</span>}
//   //       {item.submenu && isSidebarOpen && (
//   //         <i className={`submenu-toggle fas ${expandedMenus[item.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
//   //       )}
//   //     </div>
//   //     {item.submenu && expandedMenus[item.id] && (
//   //       <ul className="submenu">
//   //         {item.submenu.map(subItem => (
//   //           <li
//   //             key={subItem.id}
//   //             className={`submenu-item ${selectedView === subItem.id ? 'active' : ''}`}
//   //             onClick={() => handleMenuItemClick(subItem.id)}
//   //           >
//   //             <i className={subItem.icon}></i>
//   //             {isSidebarOpen && subItem.name}
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     )}
//   //   </li>
//   // );


  
//   const renderMenuItem = (item) => {
//     // Only render if the item or any of its submenu items are accessible
//     if (!isMenuItemAccessible(item)) {
//       return null;
//     }

//     return (
//       <li key={item.id} className="menu-item-container">
//         <div
//           className={`menu-item ${selectedView === item.id ? 'active' : ''}`}
//           onClick={() => item.submenu ? toggleSubmenu(item.id) : handleMenuItemClick(item.id)}
//         >
//           <i className={item.icon}></i>
//           {isSidebarOpen && <span>{item.name}</span>}
//           {item.submenu && isSidebarOpen && (
//             <i className={`submenu-toggle fas ${expandedMenus[item.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
//           )}
//         </div>
//         {item.submenu && expandedMenus[item.id] && (
//           <ul className="submenu">
//             {item.submenu
//               .filter(subItem => isSubmenuItemAccessible(subItem))
//               .map(subItem => (
//                 <li
//                   key={subItem.id}
//                   className={`submenu-item ${selectedView === subItem.id ? 'active' : ''}`}
//                   onClick={() => handleMenuItemClick(subItem.id)}
//                 >
//                   <i className={subItem.icon}></i>
//                   {isSidebarOpen && subItem.name}
//                 </li>
//               ))}
//           </ul>
//         )}
//       </li>
//     );
//   };

//   // const renderContent = () => {
//   //   // const currentRoute = location.pathname.split('/')[2] || 'home';
//   //   // const allMenuIds = getAllMenuIds(menuItems);
//   //   // const restrictedRoutes = allMenuIds.filter(id => !accessibleMenuItems.includes(id));

//   //   // // If route is restricted, redirect to home
//   //   // if (restrictedRoutes.includes(currentRoute)) {
//   //   //   navigate('/HR_dash/home');
//   //   //   return null;
//   //   // }
//   //   // Special routes handling
//   //   if (currentPath) {
//   //     // Job Description route
//   //     if (currentPath.startsWith('job_desc/')) {
//   //       if (accessibleMenuItems.includes('jobs')) {
//   //         const jobId = currentPath.split('/')[1];
//   //         return <HrJobDesc jobId={jobId} setSelectedView={setSelectedView} />;
//   //       }
//   //     }

//   //     // Student Details route
//   //     if (currentPath.startsWith('student/')) {
//   //       if (isSpecialRouteAccessible('student/')) {
//   //         const candidateID = currentPath.split('/')[1];
//   //         return <StudentDetails candidateID={candidateID} />;
//   //       }
//   //     }

//   //     // Quiz Preview route
//   //     if (currentPath.startsWith('preview/')) {
//   //       if (accessibleMenuItems.includes('quiz')) {
//   //         const token = currentPath.split('/')[1];
//   //         return <PreviewQuiz token={token} />;
//   //       }
//   //     }

//   //     // Quiz Edit route
//   //     if (currentPath.startsWith('edit/')) {
//   //       if (accessibleMenuItems.includes('quiz')) {
//   //         const defaultTab = currentPath.split('/')[1];
//   //         const token = currentPath.split('/')[2];
//   //         return <CreateDash defaultTab={defaultTab} token={token} />;
//   //       }
//   //     }

//   //     // Company Details route
//   //     if (currentPath.startsWith('companies/')) {
//   //       if (accessibleMenuItems.includes('companies')) {
//   //         const companyID = currentPath.split('/')[1];
//   //         return <CompanyData companyID={companyID} />;
//   //       }
//   //     }
//   //   }
  
//   //   const statusMapping = {
//   //     "students-qualified": "qualified",
//   //     "students-not-qualified": "not-qualified",
//   //     "students-placed": "placed",
//   //     "students-not-placed": "not-placed",
//   //     "not-attended": "not-attended",
//   //     "under-progress": "under-progress",
//   //     "interns-not-interested": "not-interested",
//   //     "not-eligible": "not-eligible",
//   //     "eligible": "eligible",
//   //     "level-1": "level-1",
//   //     "level-2": "level-2",
//   //     "level-3": "level-3",
//   //   };

//   //   switch (selectedView) {

//   //     case 'lms':
//   //       return <HrLMSDash />

//   //     case 'quiz':
//   //       return <QuizDash />

//   //     case 'internRequests':
//   //       return <RegistrationRequests />;

//   //     case 'guestRequests':
//   //       return <GuestRegistrationRequests />

//   //     case 'postjob':
//   //       return <HrPostJobs />;

//   //     case 'jobs':
//   //       return <HrViewJobs />;

//   //     case 'companies':
//   //       return <HrLeads />

//   //     case 'internshipCertificate':
//   //       return <CertificateGenerator />

//   //     case 'offerLetter':
//   //       return <OfferLetter />

//   //     case 'bulkIntern':
//   //       return <InternBulkRegister />
//   //     case 'bulkGuest':
//   //       return <GuestBulkRegister />

//   //     case 'profile':
//   //       return <ProfilePage />

//   //     case "students-applied":
//   //       return <JobApplicationsTable />

//   //     case "students-qualified":
//   //     case "students-not-qualified":
//   //     case "students-placed":
//   //     case "students-not-placed":
//   //     case "not-attended":
//   //     case "interns-not-interested":
//   //     case "not-eligible":
//   //     case "under-progress":
//   //     case "eligible":
//   //     case 'level-1':
//   //     case 'level-2':
//   //     case 'level-3':
//   //       return <StudentsPlaced status={statusMapping[selectedView]} />;

//   //     case "hr-leads":
//   //       return <HrLeads />
//   //     case "all-jobs":
//   //       return <JobStatus statusInfo="all-jobs" />;
//   //     case "jd-received":
//   //       return <JobStatus statusInfo="jd-received" />;
//   //     case "profiles-sent":
//   //       return <JobStatus statusInfo="profiles-sent" />;
//   //     case "drive-scheduled":
//   //       return <JobStatus statusInfo="drive-scheduled" />;
//   //     case "drive-done":
//   //       return <JobStatus statusInfo="drive-done" />;
//   //     case "not-interested":
//   //       return <JobStatus statusInfo="not-interested" />;
//   //     case 'dashboard':
//   //       return <HrPortal />


//   //     default:
//   //       return <HrPortal />;
//   //   }
//   // };

//   const renderContent = () => {
//     // Special routes handling
//     if (currentPath) {
//       if (currentPath.startsWith('job_desc/')) {
//         if (accessibleMenuItems.includes('jobs')) {
//           const jobId = currentPath.split('/')[1];
//           return <HrJobDesc jobId={jobId} setSelectedView={setSelectedView} />;
//         }
//         return null;
//       }
  
//       if (currentPath.startsWith('student/')) {
//         if (isSpecialRouteAccessible('student/')) {
//           const candidateID = currentPath.split('/')[1];
//           return <StudentDetails candidateID={candidateID} />;
//         }
//         return null;
//       }
  
//       if (currentPath.startsWith('preview/')) {
//         if (accessibleMenuItems.includes('quiz')) {
//           const token = currentPath.split('/')[1];
//           return <PreviewQuiz token={token} />;
//         }
//         return null;
//       }
  
//       if (currentPath.startsWith('edit/')) {
//         if (accessibleMenuItems.includes('quiz')) {
//           const defaultTab = currentPath.split('/')[1];
//           const token = currentPath.split('/')[2];
//           return <CreateDash defaultTab={defaultTab} token={token} />;
//         }
//         return null;
//       }
  
//       if (currentPath.startsWith('companies/')) {
//         if (accessibleMenuItems.includes('companies')) {
//           const companyID = currentPath.split('/')[1];
//           return <CompanyData companyID={companyID} />;
//         }
//         return null;
//       }
//     }
  
//     const statusMapping = {
//       "students-qualified": "qualified",
//       "students-not-qualified": "not-qualified",
//       "students-placed": "placed",
//       "students-not-placed": "not-placed",
//       "not-attended": "not-attended",
//       "under-progress": "under-progress",
//       "interns-not-interested": "not-interested",
//       "not-eligible": "not-eligible",
//       "eligible": "eligible",
//       "level-1": "level-1",
//       "level-2": "level-2",
//       "level-3": "level-3",
//     };
  
//     switch (selectedView) {
//       case 'lms':
//         if (accessibleMenuItems.includes('lms')) {
//           return <HrLMSDash />;
//         }
//         break;
  
//       case 'quiz':
//         if (accessibleMenuItems.includes('quiz')) {
//           return <QuizDash />;
//         }
//         break;
  
//       case 'internRequests':
//         if (accessibleMenuItems.includes('internRequests')) {
//           return <RegistrationRequests />;
//         }
//         break;
  
//       case 'guestRequests':
//         if (accessibleMenuItems.includes('guestRequests')) {
//           return <GuestRegistrationRequests />;
//         }
//         break;
  
//       case 'postjob':
//         if (accessibleMenuItems.includes('postjob')) {
//           return <HrPostJobs />;
//         }
//         break;
  
//       case 'jobs':
//         if (accessibleMenuItems.includes('jobs')) {
//           return <HrViewJobs />;
//         }
//         break;
  
//       case 'companies':
//         if (accessibleMenuItems.includes('companies')) {
//           return <HrLeads />;
//         }
//         break;
  
//       case 'internshipCertificate':
//         if (accessibleMenuItems.includes('internshipCertificate')) {
//           return <CertificateGenerator />;
//         }
//         break;
  
//       case 'offerLetter':
//         if (accessibleMenuItems.includes('offerLetter')) {
//           return <OfferLetter />;
//         }
//         break;
  
//       case 'bulkIntern':
//         if (accessibleMenuItems.includes('bulkIntern')) {
//           return <InternBulkRegister />;
//         }
//         break;
  
//       case 'bulkGuest':
//         if (accessibleMenuItems.includes('bulkGuest')) {
//           return <GuestBulkRegister />;
//         }
//         break;
  
//       case 'profile':
//         if (accessibleMenuItems.includes('profile')) {
//           return <ProfilePage />;
//         }
//         break;
  
//       case 'students-applied':
//         if (accessibleMenuItems.includes('students-applied')) {
//           return <JobApplicationsTable />;
//         }
//         break;
  
//       case 'students-qualified':
//       case 'students-not-qualified':
//       case 'students-placed':
//       case 'students-not-placed':
//       case 'not-attended':
//       case 'interns-not-interested':
//       case 'not-eligible':
//       case 'under-progress':
//       case 'eligible':
//       case 'level-1':
//       case 'level-2':
//       case 'level-3':
//         if (accessibleMenuItems.includes(selectedView)) {
//           return <StudentsPlaced status={statusMapping[selectedView]} />;
//         }
//         break;
  
//       case 'hr-leads':
//         if (accessibleMenuItems.includes('hr-leads')) {
//           return <HrLeads />;
//         }
//         break;
  
//       case 'all-jobs':
//       case 'jd-received':
//       case 'profiles-sent':
//       case 'drive-scheduled':
//       case 'drive-done':
//       case 'not-interested':
//         if (accessibleMenuItems.includes(selectedView)) {
//           return <JobStatus statusInfo={selectedView} />;
//         }
//         break;
  
//       case 'dashboard':
//       case 'home':
//         if (accessibleMenuItems.includes('home')) {
//           return <HrPortal />;
//         }
//         break;
  
//       default:
//         if (accessibleMenuItems.includes('home')) {
//           return <HrPortal />;
//         }
//         break;
//     }
  
//     // If no access or invalid route, redirect to home
//     navigate('/HR_dash/home');
//     return null;
//   };


//   return (
//     <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <nav className={`SA_side-nav ${isSidebarOpen ? 'open' : 'closed'}`}>
//         <div className="logo">
//           {isSidebarOpen ? <img className="logo-img" src={RSLogo} alt='text' /> : ''}
//         </div>
//         <button className="SA-toggle-button" onClick={toggleSidebar}>
//           <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
//         </button>
//         <div className='icons-container'>
//           <ul>
//             {menuItems.map(renderMenuItem)}
//           </ul>
//         </div>
//       </nav>
//       <div className={`main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
//         <div className="top-panel">
//           <div className="pvpk">
//             <Dropdown.Item className="btn bg-transparent logout-btn fw-bold w-100 pt-0" style={{ cursor: "auto" }}>
//               {name}
//             </Dropdown.Item>
//             <button
//               onClick={logout}
//               className="btn bg-transparent logout-btn fw-bold w-100 pt-0"
//               style={{ color: 'white' }}
//             >
//               <FontAwesomeIcon icon={faSignOutAlt} />
//             </button>
//           </div>
//         </div>

//         {renderContent()}
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default HRDash;