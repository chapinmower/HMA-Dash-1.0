// Validation utility functions for the project management system

export const validateProject = (projectData) => {
  const errors = {};

  // Required fields validation
  if (!projectData.name || projectData.name.trim().length === 0) {
    errors.name = 'Project name is required';
  } else if (projectData.name.length > 100) {
    errors.name = 'Project name must be less than 100 characters';
  }

  if (!projectData.description || projectData.description.trim().length === 0) {
    errors.description = 'Project description is required';
  } else if (projectData.description.length > 1000) {
    errors.description = 'Project description must be less than 1000 characters';
  }

  // Status validation
  const validStatuses = ['Pipeline', 'Ongoing', 'Completed'];
  if (projectData.status && !validStatuses.includes(projectData.status)) {
    errors.status = 'Invalid project status';
  }

  // Priority validation
  const validPriorities = ['Low', 'Medium', 'High'];
  if (projectData.priority && !validPriorities.includes(projectData.priority)) {
    errors.priority = 'Invalid project priority';
  }

  // Date validation
  if (projectData.startDate && projectData.endDate) {
    const startDate = new Date(projectData.startDate);
    const endDate = new Date(projectData.endDate);
    
    if (endDate < startDate) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Progress validation
  if (projectData.completionPercentage !== undefined) {
    const progress = Number(projectData.completionPercentage);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      errors.completionPercentage = 'Progress must be between 0 and 100';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateMilestone = (milestoneData) => {
  const errors = {};

  // Required fields validation
  if (!milestoneData.name || milestoneData.name.trim().length === 0) {
    errors.name = 'Milestone name is required';
  } else if (milestoneData.name.length > 100) {
    errors.name = 'Milestone name must be less than 100 characters';
  }

  if (!milestoneData.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const dueDate = new Date(milestoneData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  // Status validation
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (milestoneData.status && !validStatuses.includes(milestoneData.status)) {
    errors.status = 'Invalid milestone status';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRequest = (requestData) => {
  const errors = {};

  // Required fields validation
  if (!requestData.title || requestData.title.trim().length === 0) {
    errors.title = 'Request title is required';
  } else if (requestData.title.length > 200) {
    errors.title = 'Request title must be less than 200 characters';
  }

  if (!requestData.description || requestData.description.trim().length === 0) {
    errors.description = 'Request description is required';
  } else if (requestData.description.length > 2000) {
    errors.description = 'Request description must be less than 2000 characters';
  }

  if (!requestData.type) {
    errors.type = 'Request type is required';
  }

  if (!requestData.priority) {
    errors.priority = 'Request priority is required';
  }

  if (!requestData.requestedBy) {
    errors.requestedBy = 'Requested by field is required';
  }

  // Date validation
  if (requestData.dueDate) {
    const dueDate = new Date(requestData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProjectUpdate = (updateData) => {
  const errors = {};

  if (!updateData.message || updateData.message.trim().length === 0) {
    errors.message = 'Update message is required';
  } else if (updateData.message.length > 1000) {
    errors.message = 'Update message must be less than 1000 characters';
  }

  const validTypes = ['update', 'milestone', 'issue', 'achievement', 'status_change'];
  if (!updateData.type || !validTypes.includes(updateData.type)) {
    errors.type = 'Invalid update type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Data sanitization functions
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

export const sanitizeProject = (projectData) => {
  return {
    ...projectData,
    name: sanitizeString(projectData.name),
    description: sanitizeString(projectData.description),
    category: sanitizeString(projectData.category),
    assignedTo: sanitizeString(projectData.assignedTo)
  };
};

export const sanitizeMilestone = (milestoneData) => {
  return {
    ...milestoneData,
    name: sanitizeString(milestoneData.name)
  };
};

export const sanitizeRequest = (requestData) => {
  return {
    ...requestData,
    title: sanitizeString(requestData.title),
    description: sanitizeString(requestData.description),
    estimatedHours: sanitizeString(requestData.estimatedHours),
    successMetrics: sanitizeString(requestData.successMetrics)
  };
};

// Helper functions
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatValidationErrors = (errors) => {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');
};