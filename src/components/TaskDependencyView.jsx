import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  AccountTree as TreeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Block as BlockIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const TaskDependencyView = ({ projects, onTaskUpdate }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [dependencyDialog, setDependencyDialog] = useState(false);
  const [taskMap, setTaskMap] = useState(new Map());

  useEffect(() => {
    // Create a map of all tasks for quick lookup
    const map = new Map();
    projects.forEach(project => {
      project.tasks?.forEach(task => {
        map.set(task.id, { ...task, projectId: project.id, projectName: project.name });
      });
    });
    setTaskMap(map);
  }, [projects]);

  const getTaskById = (taskId) => {
    return taskMap.get(taskId);
  };

  const getDependentTasks = (taskId) => {
    return Array.from(taskMap.values()).filter(task => 
      task.dependencies && task.dependencies.includes(taskId)
    );
  };

  const canStartTask = (task) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const depTask = getTaskById(depId);
      return depTask && depTask.status === 'Completed';
    });
  };

  const getBlockedTasks = () => {
    return Array.from(taskMap.values()).filter(task => 
      task.status === 'Not Started' && !canStartTask(task)
    );
  };

  const getReadyTasks = () => {
    return Array.from(taskMap.values()).filter(task => 
      task.status === 'Not Started' && canStartTask(task)
    );
  };

  const getInProgressTasks = () => {
    return Array.from(taskMap.values()).filter(task => 
      task.status === 'In Progress'
    );
  };

  const getCompletedTasks = () => {
    return Array.from(taskMap.values()).filter(task => 
      task.status === 'Completed'
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Not Started': return 'info';
      case 'Blocked': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDependencyDialog(true);
  };

  const TaskCard = ({ task, showProject = true }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 }
      }}
      onClick={() => handleTaskClick(task)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h3" sx={{ fontSize: '1rem' }}>
            {task.title}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip 
              label={task.status} 
              color={getStatusColor(task.status)}
              size="small"
            />
            <Chip 
              label={task.priority} 
              color={getPriorityColor(task.priority)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {showProject && (
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Project: {task.projectName}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" mb={2}>
          {task.description}
        </Typography>

        {task.progress !== undefined && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{task.progress}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={task.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {task.dueDate && `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
          </Typography>
          
          <Box display="flex" gap={1}>
            {task.dependencies && task.dependencies.length > 0 && (
              <Chip 
                icon={<TreeIcon />}
                label={`${task.dependencies.length} deps`}
                size="small"
                variant="outlined"
              />
            )}
            {!canStartTask(task) && task.status === 'Not Started' && (
              <Chip 
                icon={<BlockIcon />}
                label="Blocked"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TaskSection = ({ title, tasks, icon, color = 'primary' }) => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
          {title}
        </Typography>
        <Chip label={tasks.length} color={color} size="small" />
      </Box>
      
      {tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
          No tasks in this category
        </Typography>
      ) : (
        tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </Paper>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Task Dependencies
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {getCompletedTasks().length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {getInProgressTasks().length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {getReadyTasks().length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ready to Start
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {getBlockedTasks().length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Blocked
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Blocked Tasks Alert */}
      {getBlockedTasks().length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            {getBlockedTasks().length} task(s) are blocked by incomplete dependencies
          </Typography>
        </Alert>
      )}

      {/* Task Categories */}
      <TaskSection 
        title="Ready to Start" 
        tasks={getReadyTasks()} 
        icon={<PlayArrowIcon color="success" />}
        color="success"
      />

      <TaskSection 
        title="In Progress" 
        tasks={getInProgressTasks()} 
        icon={<TimelineIcon color="warning" />}
        color="warning"
      />

      <TaskSection 
        title="Blocked (Waiting for Dependencies)" 
        tasks={getBlockedTasks()} 
        icon={<BlockIcon color="error" />}
        color="error"
      />

      <TaskSection 
        title="Completed" 
        tasks={getCompletedTasks()} 
        icon={<CheckCircleIcon color="success" />}
        color="success"
      />

      {/* Task Detail Dialog */}
      <Dialog 
        open={dependencyDialog} 
        onClose={() => setDependencyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AssignmentIcon sx={{ mr: 1 }} />
            Task Dependencies
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTask.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Project: {selectedTask.projectName}
              </Typography>

              <Box display="flex" gap={1} mb={3}>
                <Chip 
                  label={selectedTask.status} 
                  color={getStatusColor(selectedTask.status)}
                  size="small"
                />
                <Chip 
                  label={selectedTask.priority} 
                  color={getPriorityColor(selectedTask.priority)}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Typography variant="body1" gutterBottom>
                {selectedTask.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Dependencies */}
              <Typography variant="h6" gutterBottom>
                Dependencies ({selectedTask.dependencies?.length || 0})
              </Typography>
              
              {selectedTask.dependencies && selectedTask.dependencies.length > 0 ? (
                <List dense>
                  {selectedTask.dependencies.map(depId => {
                    const depTask = getTaskById(depId);
                    return depTask ? (
                      <ListItem key={depId}>
                        <ListItemIcon>
                          {depTask.status === 'Completed' ? 
                            <CheckCircleIcon color="success" /> : 
                            <ScheduleIcon color="warning" />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={depTask.title}
                          secondary={`${depTask.projectName} • ${depTask.status}`}
                        />
                      </ListItem>
                    ) : (
                      <ListItem key={depId}>
                        <ListItemText primary={`Unknown task (ID: ${depId})`} />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                  No dependencies - this task can be started immediately
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Dependent Tasks */}
              <Typography variant="h6" gutterBottom>
                Tasks Waiting for This Task ({getDependentTasks(selectedTask.id).length})
              </Typography>
              
              {getDependentTasks(selectedTask.id).length > 0 ? (
                <List dense>
                  {getDependentTasks(selectedTask.id).map(depTask => (
                    <ListItem key={depTask.id}>
                      <ListItemIcon>
                        <ScheduleIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary={depTask.title}
                        secondary={`${depTask.projectName} • ${depTask.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                  No tasks are waiting for this one
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDependencyDialog(false)}>Close</Button>
          {selectedTask && onTaskUpdate && (
            <Button 
              variant="contained" 
              onClick={() => {
                // This would trigger a task update in the parent component
                onTaskUpdate(selectedTask.projectId, selectedTask.id, { status: 'In Progress' });
                setDependencyDialog(false);
              }}
              disabled={selectedTask.status !== 'Not Started' || !canStartTask(selectedTask)}
            >
              Start Task
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDependencyView;