import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const reportPeriodTypes = [
  { value: 'Month', label: 'Monthly' },
  { value: 'Quarter', label: 'Quarterly' },
  { value: 'Year', label: 'Yearly' }
];

const LinkedInAnalyticsForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formState, setFormState] = useState(initialData || {
    report_period_type: 'Month',
    report_start_date: null,
    report_end_date: null,
    impressions: '',
    engagements: '',
    clicks: '',
    followers: '',
    follower_change: '',
    posts: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormState(prev => ({
      ...prev,
      [name]: date
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Add a new post entry
  const handleAddPost = () => {
    setFormState(prev => ({
      ...prev,
      posts: [...prev.posts, {
        post_title: '',
        post_date: null,
        post_url: '',
        impressions: '',
        reactions: '',
        comments: '',
        shares: '',
        clicks: ''
      }]
    }));
  };

  // Remove a post at specific index
  const handleRemovePost = (index) => {
    setFormState(prev => ({
      ...prev,
      posts: prev.posts.filter((_, i) => i !== index)
    }));
  };

  // Handle changes to post fields
  const handlePostChange = (index, field, value) => {
    setFormState(prev => {
      const newPosts = [...prev.posts];
      newPosts[index] = {
        ...newPosts[index],
        [field]: value
      };
      return { ...prev, posts: newPosts };
    });
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formState.report_period_type) newErrors.report_period_type = 'Period type is required';
    if (!formState.report_start_date) newErrors.report_start_date = 'Start date is required';
    if (!formState.report_end_date) newErrors.report_end_date = 'End date is required';
    
    // Numeric fields validation
    if (formState.impressions && isNaN(Number(formState.impressions))) {
      newErrors.impressions = 'Must be a number';
    }
    if (formState.engagements && isNaN(Number(formState.engagements))) {
      newErrors.engagements = 'Must be a number';
    }
    if (formState.clicks && isNaN(Number(formState.clicks))) {
      newErrors.clicks = 'Must be a number';
    }
    if (formState.followers && isNaN(Number(formState.followers))) {
      newErrors.followers = 'Must be a number';
    }
    if (formState.follower_change && isNaN(Number(formState.follower_change))) {
      newErrors.follower_change = 'Must be a number';
    }
    
    // Date order validation
    if (formState.report_start_date && formState.report_end_date && 
        new Date(formState.report_start_date) > new Date(formState.report_end_date)) {
      newErrors.report_end_date = 'End date must be after start date';
    }
    
    // Validate posts if any
    if (formState.posts && formState.posts.length > 0) {
      formState.posts.forEach((post, index) => {
        if (!post.post_title) {
          newErrors[`post_${index}_title`] = 'Post title is required';
        }
        if (!post.post_date) {
          newErrors[`post_${index}_date`] = 'Post date is required';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Convert string number values to actual numbers for API submission
      const formData = {
        ...formState,
        impressions: formState.impressions ? parseInt(formState.impressions, 10) : null,
        engagements: formState.engagements ? parseInt(formState.engagements, 10) : null,
        clicks: formState.clicks ? parseInt(formState.clicks, 10) : null,
        followers: formState.followers ? parseInt(formState.followers, 10) : null,
        follower_change: formState.follower_change ? parseInt(formState.follower_change, 10) : null,
        posts: formState.posts.map(post => ({
          ...post,
          impressions: post.impressions ? parseInt(post.impressions, 10) : null,
          reactions: post.reactions ? parseInt(post.reactions, 10) : null,
          comments: post.comments ? parseInt(post.comments, 10) : null,
          shares: post.shares ? parseInt(post.shares, 10) : null,
          clicks: post.clicks ? parseInt(post.clicks, 10) : null
        }))
      };
      
      onSubmit(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { overflowY: 'auto' }
      }}
    >
      <DialogTitle>
        {initialData ? 'Edit LinkedIn Analytics Data' : 'Add LinkedIn Analytics Data'}
      </DialogTitle>
      
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Reporting Period
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" error={!!errors.report_period_type}>
                <InputLabel>Period Type</InputLabel>
                <Select
                  name="report_period_type"
                  value={formState.report_period_type}
                  onChange={handleChange}
                  label="Period Type"
                >
                  {reportPeriodTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Start Date"
                value={formState.report_start_date}
                onChange={(date) => handleDateChange('report_start_date', date)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    variant="outlined" 
                    error={!!errors.report_start_date}
                    helperText={errors.report_start_date}
                  />
                )}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    error: !!errors.report_start_date,
                    helperText: errors.report_start_date
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="End Date"
                value={formState.report_end_date}
                onChange={(date) => handleDateChange('report_end_date', date)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    variant="outlined" 
                    error={!!errors.report_end_date}
                    helperText={errors.report_end_date}
                  />
                )}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    error: !!errors.report_end_date,
                    helperText: errors.report_end_date
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Summary Metrics
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="impressions"
                label="Impressions"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.impressions}
                onChange={handleChange}
                error={!!errors.impressions}
                helperText={errors.impressions}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="engagements"
                label="Engagements"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.engagements}
                onChange={handleChange}
                error={!!errors.engagements}
                helperText={errors.engagements}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="clicks"
                label="Click Through"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.clicks}
                onChange={handleChange}
                error={!!errors.clicks}
                helperText={errors.clicks}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="followers"
                label="Total Followers"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.followers}
                onChange={handleChange}
                error={!!errors.followers}
                helperText={errors.followers}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="follower_change"
                label="Follower Change"
                type="number"
                fullWidth
                variant="outlined"
                value={formState.follower_change}
                onChange={handleChange}
                error={!!errors.follower_change}
                helperText={errors.follower_change}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">
                  Top Performing Posts
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleAddPost}
                  variant="outlined"
                  size="small"
                >
                  Add Post
                </Button>
              </Box>
            </Grid>
            
            {formState.posts && formState.posts.length > 0 ? (
              formState.posts.map((post, index) => (
                <Grid item xs={12} key={index} container spacing={2} sx={{ mb: 2, mx: 0, p: 1, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                  <Grid item xs={10} sm={11}>
                    <Typography variant="subtitle2">Post #{index + 1}</Typography>
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
                    <IconButton size="small" onClick={() => handleRemovePost(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Post Title"
                      fullWidth
                      variant="outlined"
                      value={post.post_title}
                      onChange={(e) => handlePostChange(index, 'post_title', e.target.value)}
                      error={!!errors[`post_${index}_title`]}
                      helperText={errors[`post_${index}_title`]}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Post Date"
                      value={post.post_date}
                      onChange={(date) => handlePostChange(index, 'post_date', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          size: "small",
                          margin: "dense",
                          error: !!errors[`post_${index}_date`],
                          helperText: errors[`post_${index}_date`]
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Post URL"
                      fullWidth
                      variant="outlined"
                      value={post.post_url}
                      onChange={(e) => handlePostChange(index, 'post_url', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Impressions"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={post.impressions}
                      onChange={(e) => handlePostChange(index, 'impressions', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Reactions"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={post.reactions}
                      onChange={(e) => handlePostChange(index, 'reactions', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Comments"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={post.comments}
                      onChange={(e) => handlePostChange(index, 'comments', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Shares"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={post.shares}
                      onChange={(e) => handlePostChange(index, 'shares', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Clicks"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={post.clicks}
                      onChange={(e) => handlePostChange(index, 'clicks', e.target.value)}
                      size="small"
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" align="center">
                  No posts added yet. Click "Add Post" to include top performing posts.
                </Typography>
              </Grid>
            )}
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {initialData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInAnalyticsForm;