import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { validateProject, validateMilestone, sanitizeProject, sanitizeMilestone } from '../utils/validation';

// Create the ProjectContext
const ProjectContext = createContext({
  projects: [],
  tracking: [],
  loading: false,
  error: null,
  updateProject: () => {},
  createProject: () => {},
  deleteProject: () => {},
  addMilestone: () => {},
  updateTracking: () => {},
  convertRequestToProject: () => {},
  refreshProjects: () => {},
  getProjectById: () => {},
  updateProjectStatus: () => {},
  updateProjectProgress: () => {},
  addProjectUpdate: () => {},
  updateMilestone: () => {},
  deleteMilestone: () => {}
});

// Custom hook to use the ProjectContext
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

// ProjectProvider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data from localStorage and JSON files
  useEffect(() => {
    loadProjectData();
  }, []);

  // Load project data from both localStorage and JSON files
  const loadProjectData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load projects from JSON file
      const projectsResponse = await fetch('/data/enhanced_projects.json');
      const projectsData = await projectsResponse.json();
      
      // Load tracking data from localStorage or initialize
      const storedTracking = localStorage.getItem('projectTracking');
      const trackingData = storedTracking ? JSON.parse(storedTracking) : [];
      
      // Merge with any localStorage project updates
      const storedProjects = localStorage.getItem('projects');
      const localProjects = storedProjects ? JSON.parse(storedProjects) : [];
      
      // Merge projects (localStorage takes precedence for updates)
      const mergedProjects = mergeProjectData(projectsData.projects, localProjects);
      
      setProjects(mergedProjects);
      setTracking(trackingData);
    } catch (err) {
      console.error('Error loading project data:', err);
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  // Merge project data from different sources
  const mergeProjectData = (fileProjects, localProjects) => {
    const projectMap = new Map();
    
    // Add file projects first
    fileProjects.forEach(project => {
      projectMap.set(project.id, project);
    });
    
    // Override with local projects
    localProjects.forEach(project => {
      projectMap.set(project.id, project);
    });
    
    return Array.from(projectMap.values());
  };

  // Save projects to localStorage
  const saveProjects = useCallback((updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  }, []);

  // Save tracking data to localStorage
  const saveTracking = useCallback((updatedTracking) => {
    setTracking(updatedTracking);
    localStorage.setItem('projectTracking', JSON.stringify(updatedTracking));
  }, []);

  // Generate unique project ID
  const generateProjectId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    return `PROJ-${year}-${String(randomNum).padStart(3, '0')}`;
  };

  // Generate default milestones for new project
  const generateDefaultMilestones = (project) => {
    const startDate = new Date(project.startDate || Date.now());
    const endDate = project.endDate ? new Date(project.endDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: `m1-${Date.now()}`,
        name: 'Project Kickoff',
        dueDate: startDate.toISOString().split('T')[0],
        status: 'pending',
        completedDate: null
      },
      {
        id: `m2-${Date.now() + 1}`,
        name: 'Initial Planning Complete',
        dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        completedDate: null
      },
      {
        id: `m3-${Date.now() + 2}`,
        name: 'Mid-Project Review',
        dueDate: new Date((startDate.getTime() + endDate.getTime()) / 2).toISOString().split('T')[0],
        status: 'pending',
        completedDate: null
      },
      {
        id: `m4-${Date.now() + 3}`,
        name: 'Final Delivery',
        dueDate: endDate.toISOString().split('T')[0],
        status: 'pending',
        completedDate: null
      }
    ];
  };

  // Create a new project
  const createProject = useCallback((projectData) => {
    // Validate and sanitize project data
    const sanitizedData = sanitizeProject(projectData);
    const validation = validateProject(sanitizedData);
    
    if (!validation.isValid) {
      console.error('Project validation failed:', validation.errors);
      throw new Error('Project validation failed: ' + Object.values(validation.errors).join(', '));
    }

    const newProject = {
      id: sanitizedData.id || generateProjectId(),
      name: sanitizedData.name,
      description: sanitizedData.description,
      status: sanitizedData.status || 'Pipeline',
      priority: sanitizedData.priority || 'Medium',
      category: sanitizedData.category || 'General',
      assignedTo: sanitizedData.assignedTo || 'Unassigned',
      startDate: sanitizedData.startDate || new Date().toISOString().split('T')[0],
      endDate: sanitizedData.endDate,
      completionPercentage: 0,
      tasks: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      requestId: sanitizedData.requestId
    };

    // Create tracking record
    const newTracking = {
      projectId: newProject.id,
      projectName: newProject.name,
      status: newProject.status,
      priority: newProject.priority,
      startDate: newProject.startDate,
      targetDate: newProject.endDate,
      actualEndDate: null,
      progress: 0,
      owner: projectData.requestedBy || 'Marketing Executive',
      team: [newProject.assignedTo],
      milestones: generateDefaultMilestones(newProject),
      updates: [{
        timestamp: new Date().toISOString(),
        user: 'System',
        type: 'created',
        message: 'Project created from request'
      }],
      linkedAssets: [],
      budget: {
        allocated: 0,
        spent: 0,
        currency: 'USD'
      },
      metrics: {
        expectedROI: null,
        actualROI: null
      }
    };

    const updatedProjects = [...projects, newProject];
    const updatedTracking = [...tracking, newTracking];
    
    saveProjects(updatedProjects);
    saveTracking(updatedTracking);
    
    return newProject;
  }, [projects, tracking, saveProjects, saveTracking]);

  // Update an existing project
  const updateProject = useCallback((projectId, updates) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, ...updates, lastUpdated: new Date().toISOString() }
        : project
    );
    
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  // Delete a project
  const deleteProject = useCallback((projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    const updatedTracking = tracking.filter(track => track.projectId !== projectId);
    
    saveProjects(updatedProjects);
    saveTracking(updatedTracking);
  }, [projects, tracking, saveProjects, saveTracking]);

  // Add milestone to project
  const addMilestone = useCallback((projectId, milestone) => {
    // Validate and sanitize milestone data
    const sanitizedMilestone = sanitizeMilestone(milestone);
    const validation = validateMilestone(sanitizedMilestone);
    
    if (!validation.isValid) {
      console.error('Milestone validation failed:', validation.errors);
      throw new Error('Milestone validation failed: ' + Object.values(validation.errors).join(', '));
    }

    const updatedTracking = tracking.map(track => {
      if (track.projectId === projectId) {
        return {
          ...track,
          milestones: [...track.milestones, {
            id: `m-${Date.now()}`,
            name: sanitizedMilestone.name,
            dueDate: sanitizedMilestone.dueDate,
            status: sanitizedMilestone.status || 'pending',
            completedDate: null
          }]
        };
      }
      return track;
    });
    
    saveTracking(updatedTracking);
  }, [tracking, saveTracking]);

  // Update milestone
  const updateMilestone = useCallback((projectId, milestoneId, updates) => {
    const updatedTracking = tracking.map(track => {
      if (track.projectId === projectId) {
        return {
          ...track,
          milestones: track.milestones.map(milestone =>
            milestone.id === milestoneId
              ? { ...milestone, ...updates }
              : milestone
          )
        };
      }
      return track;
    });
    
    saveTracking(updatedTracking);
    
    // Recalculate project progress
    updateProjectProgress(projectId);
  }, [tracking, saveTracking]);

  // Delete milestone
  const deleteMilestone = useCallback((projectId, milestoneId) => {
    const updatedTracking = tracking.map(track => {
      if (track.projectId === projectId) {
        return {
          ...track,
          milestones: track.milestones.filter(m => m.id !== milestoneId)
        };
      }
      return track;
    });
    
    saveTracking(updatedTracking);
    
    // Recalculate project progress
    updateProjectProgress(projectId);
  }, [tracking, saveTracking]);

  // Update tracking data
  const updateTracking = useCallback((projectId, update) => {
    const updatedTracking = tracking.map(track => {
      if (track.projectId === projectId) {
        const newUpdate = {
          timestamp: new Date().toISOString(),
          user: update.user || 'Marketing Executive',
          type: update.type || 'update',
          message: update.message
        };
        
        return {
          ...track,
          ...update,
          updates: [...track.updates, newUpdate]
        };
      }
      return track;
    });
    
    saveTracking(updatedTracking);
  }, [tracking, saveTracking]);

  // Convert request to project
  const convertRequestToProject = useCallback((request) => {
    const projectData = {
      name: request.title,
      description: request.description,
      priority: request.priority,
      category: request.type === 'email' ? 'Marketing' : 
                request.type === 'website' ? 'Development' : 
                request.type === 'event' ? 'Events' : 'General',
      assignedTo: request.assignedTo || 'Chapin Mower',
      startDate: new Date().toISOString().split('T')[0],
      endDate: request.dueDate,
      requestId: request.id,
      requestedBy: request.requestedBy
    };
    
    return createProject(projectData);
  }, [createProject]);

  // Get project by ID
  const getProjectById = useCallback((projectId) => {
    return projects.find(project => project.id === projectId);
  }, [projects]);

  // Update project status
  const updateProjectStatus = useCallback((projectId, newStatus) => {
    updateProject(projectId, { status: newStatus });
    updateTracking(projectId, {
      status: newStatus,
      type: 'status_change',
      message: `Project status changed to ${newStatus}`
    });
  }, [updateProject, updateTracking]);

  // Update project progress
  const updateProjectProgress = useCallback((projectId) => {
    const trackingRecord = tracking.find(t => t.projectId === projectId);
    if (!trackingRecord) return;
    
    const completedMilestones = trackingRecord.milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = trackingRecord.milestones.length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    
    updateProject(projectId, { completionPercentage: progress });
    updateTracking(projectId, { progress });
  }, [tracking, updateProject, updateTracking]);

  // Add project update
  const addProjectUpdate = useCallback((projectId, message, type = 'update') => {
    updateTracking(projectId, {
      type,
      message
    });
  }, [updateTracking]);

  // Refresh projects data
  const refreshProjects = useCallback(() => {
    loadProjectData();
  }, []);

  const value = {
    projects,
    tracking,
    loading,
    error,
    updateProject,
    createProject,
    deleteProject,
    addMilestone,
    updateTracking,
    convertRequestToProject,
    refreshProjects,
    getProjectById,
    updateProjectStatus,
    updateProjectProgress,
    addProjectUpdate,
    updateMilestone,
    deleteMilestone
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;