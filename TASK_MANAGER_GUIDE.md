# Enhanced Task Manager - User Guide

## Overview
The Enhanced Task Manager is a comprehensive project and task management system designed specifically for HMA Marketing. It provides complete control over project workflows, task dependencies, and team collaboration.

## Key Features

### 🗂️ **Project Management**
- **Pipeline → Ongoing → Completed** workflow
- Easy project creation and editing
- Progress tracking with visual indicators
- Category organization (Marketing, Development, Design, Strategy, Operations)
- Priority management (High, Medium, Low)

### ✅ **Task Management**
- **Dependency tracking** - Tasks can depend on other tasks
- **Status workflow**: Not Started → In Progress → Completed
- **Blocked task identification** - Visual alerts for tasks waiting on dependencies
- **Ready-to-start queue** - Tasks available to begin immediately
- Estimated hours and due date tracking
- Assignment to team members

### 🔗 **Dependency Visualization**
- **Dedicated Dependencies tab** showing:
  - Tasks ready to start (no blocking dependencies)
  - Tasks currently in progress
  - Blocked tasks (waiting for dependencies)
  - Completed tasks
- **Task detail view** with full dependency tree
- **Impact analysis** - see which tasks will be unblocked when you complete a task

### 📊 **Dashboard Features**
- **Real-time statistics** (completed, in progress, ready, blocked)
- **Progress indicators** for each project
- **Alert system** for blocked tasks
- **Quick actions** (Start project, Complete project, Add task)

## How to Use

### Creating a New Project
1. Click **"New Project"** button
2. Fill in project details:
   - Name and description
   - Status (Pipeline/Ongoing/Completed)
   - Priority level
   - Start and end dates
   - Assigned team member
   - Category
3. Click **"Create Project"**

### Adding Tasks to a Project
1. Navigate to a project card
2. Expand the tasks section
3. Click **"Add Task"**
4. Fill in task details:
   - Title and description
   - Status and priority
   - Due date and estimated hours
   - Assigned team member
   - **Dependencies** (select tasks that must be completed first)
5. Click **"Create Task"**

### Managing Dependencies
1. Go to the **"Dependencies"** tab
2. View tasks organized by status:
   - **Ready to Start**: No blocking dependencies
   - **In Progress**: Currently being worked on
   - **Blocked**: Waiting for other tasks to complete
   - **Completed**: Finished tasks
3. Click on any task to see its full dependency tree
4. Use **"Start Task"** button for ready tasks

### Project Workflow
1. **Pipeline**: New projects waiting to be started
2. **Ongoing**: Active projects being worked on
3. **Completed**: Finished projects

Use the **"Start"** and **"Complete"** buttons to move projects through the workflow.

## Data Storage
- Data is automatically saved to browser localStorage
- Changes are persistent across sessions
- Enhanced project data structure with full task tracking
- Backup data available in `/public/data/enhanced_projects.json`

## Navigation
Access the Task Manager from the sidebar: **Task Manager** → `/task-manager`

## Benefits
- **Prevents bottlenecks** by identifying blocked tasks
- **Improves planning** with dependency visualization
- **Increases efficiency** by showing ready-to-start tasks
- **Provides transparency** with real-time progress tracking
- **Supports collaboration** with assignment and status tracking

## Example Workflow
1. Create project "June 2025 Event Campaign"
2. Add tasks:
   - "Design invitations" (no dependencies)
   - "Set up email campaign" (depends on invitations)
   - "Social media promotion" (depends on email campaign)
   - "Event logistics" (depends on social media)
3. Start with "Design invitations"
4. As tasks complete, dependent tasks automatically become available
5. Track progress through the Dependencies tab

This system ensures tasks are completed in the right order and nothing falls through the cracks!