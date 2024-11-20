import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Paper,
  CircularProgress,
  Dialog
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import apiService from '../../../apiService';

const AccessManagement = ({ hrId, onClose }) => {
  const [selectedAccess, setSelectedAccess] = useState({});
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'home', label: 'Home Dashboard' },
    { 
      id: 'jobGallery', 
      label: 'Jobs Gallery',
      submenu: [
        { id: 'postjob', label: 'Post a Job' },
        { id: 'jobs', label: 'All Jobs' },
        { id: 'companies', label: 'Companies' }
      ]
    },
    { id: 'lms', label: 'Learning Management' },
    { id: 'quiz', label: 'Quiz Management' },
    { id: 'internRequests', label: 'Internship Requests' },
    { id: 'guestRequests', label: 'Guest Requests' },
    { id: 'internshipCertificate', label: 'Internship Certificates' },
    { id: 'offerLetter', label: 'Offer Letters' },
    { 
      id: 'bulkRegister', 
      label: 'Bulk Registration',
      submenu: [
        { id: 'bulkIntern', label: 'Interns' },
        { id: 'bulkGuest', label: 'Guests' }
      ]
    },
    { id: 'profile', label: 'Profile Management' }
  ];

  useEffect(() => {
    const fetchCurrentAccess = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/api/hr_access/${hrId}`);
        const data = response.data.access;
        const accessObject = {};
        data.forEach(item => {
          accessObject[item] = true;
        });
        setSelectedAccess(accessObject);
      } catch (err) {
        toast.error('No data found/Failed to load current access settings');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAccess();
  }, [hrId]);

  const handleToggleAccess = (menuId, menuItem) => {
    setSelectedAccess(prev => {
      const newAccess = { ...prev };
      
      // Toggle the clicked item
      newAccess[menuId] = !prev[menuId];
      
      // If this is a parent menu with submenu
      if (menuItem.submenu) {
        // Set all submenu items to match parent's state
        menuItem.submenu.forEach(subItem => {
          newAccess[subItem.id] = newAccess[menuId];
        });
      }
      
      // If this is a submenu item, check if we need to update parent
      menuItems.forEach(item => {
        if (item.submenu) {
          const subMenuIds = item.submenu.map(sub => sub.id);
          if (subMenuIds.includes(menuId)) {
            // Check if all submenu items are selected
            const allSubMenuSelected = item.submenu.every(sub => 
              newAccess[sub.id]
            );
            // Update parent menu state
            newAccess[item.id] = allSubMenuSelected;
          }
        }
      });
      
      return newAccess;
    });
  };

  const handleSaveAccess = async () => {
    try {
      setLoading(true);
      const selectedItems = Object.entries(selectedAccess)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      await apiService.put(`/api/hr_access/${hrId}`, {
        accessRights: selectedItems
      });

      toast.success('Access rights updated successfully');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error('Failed to update access settings');
      setLoading(false);
    }
  };

  const renderMenuItem = (item, level = 0) => (
    <Box key={item.id} sx={{ ml: level * 3 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!selectedAccess[item.id]}
            onChange={() => handleToggleAccess(item.id, item)}
            disabled={loading}
          />
        }
        label={item.label}
        sx={{ mb: 1 }}
      />
      {item.submenu && (
        <Box sx={{ ml: 3 }}>
          {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
        </Box>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Manage Access Rights for {hrId}
          </Typography>
          <Button 
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            {menuItems.map(item => renderMenuItem(item))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAccess}
            disabled={loading}
            sx={{ 
              backgroundColor: '#1f2c39',
              '&:hover': {
                backgroundColor: '#2c3e50'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Box>

        <ToastContainer />
      </Paper>
    </Dialog>
  );
};

export default AccessManagement;