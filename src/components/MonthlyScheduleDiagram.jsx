import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, IconButton,
    Modal, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Tooltip, // Added Tooltip
    InputAdornment // Added for title editing icons
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'; // Added AddIcon for Add Category button
import SaveIcon from '@mui/icons-material/Save'; // Added for saving title
import CancelIcon from '@mui/icons-material/Cancel'; // Added for cancelling title edit
import apiClient from '../apiClient'; // Assuming apiClient handles API calls

// --- Schedule Item Component ---
const ScheduleItem = ({ item, onEdit, onDelete }) => {
    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle1" component="div">
                    {item.title || 'Untitled Item'}
                </Typography>
                {item.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.description}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                     <Typography variant="caption" color="text.secondary">
                        Status: {item.status || 'Planned'}
                    </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Due: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Cost: {item.cost || 'N/A'}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton size="small" onClick={() => onEdit(item)} aria-label="edit item">
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(item.id)} aria-label="delete item">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </CardActions>
        </Card>
    );
};

// --- Category Bucket Component ---
// Added onEditCategory and onDeleteCategory props
const CategoryBucket = ({ category, onAddItem, onEditItem, onDeleteItem, onEditCategory, onDeleteCategory }) => {
    return (
        <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                {/* Category Title and Edit/Delete Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 1 }}>
                    <Typography variant="h6" component="div" color="primary" sx={{ mr: 1, flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {category.title || 'Unnamed Category'}
                    </Typography>
                    <Tooltip title="Edit Category Name">
                        <IconButton size="small" onClick={() => onEditCategory(category)} aria-label={`edit category ${category.title}`}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                        <IconButton size="small" onClick={() => onDeleteCategory(category.id)} aria-label={`delete category ${category.title}`}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Box>
                {/* Add Item Button */}
                <Tooltip title="Add Item to Category">
                    <IconButton size="small" onClick={() => onAddItem(category.id)} aria-label={`add item to ${category.title}`}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Allow scrolling for items */}
                {category.items && category.items.length > 0 ? (
                    category.items.map(item => (
                        <ScheduleItem
                            key={item.id}
                            item={item}
                            onEdit={onEditItem}
                            onDelete={onDeleteItem}
                        />
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        No items planned.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

// --- Main Diagram Component ---
// Expects scheduleData: { month: string, title: string, categories: [{ id, title, items: [{ id, title, ... }] }] }
// Expects onDataChange: function to call after add/edit/delete to refresh data
function MonthlyScheduleDiagram({ scheduleData, onDataChange }) {
    // State for Item Modal
    const [editingItem, setEditingItem] = useState(null); // null or the item object being edited/added
    const [targetCategoryIdForItem, setTargetCategoryIdForItem] = useState(null); // For adding new items
    const [showItemEditModal, setShowItemEditModal] = useState(false);

    // State for Category Modal
    const [editingCategory, setEditingCategory] = useState(null); // null or the category object being edited/added
    const [showCategoryEditModal, setShowCategoryEditModal] = useState(false);

    // State for Diagram Title Editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [currentDiagramTitle, setCurrentDiagramTitle] = useState(scheduleData?.title || '');

    // General State
    const [apiError, setApiError] = useState(null); // For displaying API errors in modals or main view
    const [titleApiError, setTitleApiError] = useState(null); // Specific error for title editing

    // --- Item Handlers ---
    const handleAddItem = (categoryId) => {
        console.log("[Item] Add clicked for category:", categoryId);
        setEditingItem({ title: '', description: '', cost: '', status: 'Planned', due_date: null }); // New item template
        setTargetCategoryIdForItem(categoryId); // Remember which category we're adding to
        setShowItemEditModal(true);
        setApiError(null); // Clear error before opening modal
    };

    const handleEditItem = (item) => {
        console.log("[Item] Edit clicked:", item);
        setEditingItem({ ...item }); // Edit existing item
        setTargetCategoryIdForItem(item.category_id); // Set category context for editing
        setShowItemEditModal(true);
        setApiError(null); // Clear error before opening modal
    };

    const handleDeleteItem = async (itemId) => {
        console.log("[Item] Delete clicked:", itemId);
        if (window.confirm('Are you sure you want to delete this schedule item?')) {
            setApiError(null); // Clear previous main view errors
            try {
                await apiClient.delete(`/api/schedule_items/${itemId}`);
                onDataChange(); // Refresh data in parent
            } catch (err) {
                console.error("[Item] Error deleting:", err);
                setApiError(err.response?.data?.error || err.message || 'Failed to delete item.'); // Show error in main view
            }
        }
    };

    const handleCloseItemModal = () => {
        setShowItemEditModal(false);
        setEditingItem(null);
        setTargetCategoryIdForItem(null);
        setApiError(null); // Clear modal-specific error on close
    };

    const handleSaveItem = async (event) => {
        event.preventDefault();
        if (!editingItem || !targetCategoryIdForItem) {
            setApiError("Cannot save item: Missing item data or target category.");
            return;
        };
        setApiError(null); // Clear previous modal errors

        const itemData = {
            title: editingItem.title,
            description: editingItem.description || null,
            cost: editingItem.cost || null,
            status: editingItem.status || 'Planned',
            due_date: editingItem.due_date || null,
            category_id: targetCategoryIdForItem // Use the stored category ID
        };

        // Basic validation
        if (!itemData.title) {
            setApiError("Title is required.");
            return;
        }

        try {
            if (editingItem.id) { // Existing item -> PUT request
                console.log(`[Item] Saving existing ${editingItem.id} with data:`, itemData);
                await apiClient.put(`/api/schedule_items/${editingItem.id}`, itemData);
            } else { // New item -> POST request
                console.log("[Item] Saving new with data:", itemData);
                await apiClient.post('/api/schedule_items', itemData);
            }
            handleCloseItemModal();
            onDataChange(); // Refresh data in parent
        } catch (err) {
            console.error("[Item] Error saving:", err);
            // Display error within the modal
            setApiError(err.response?.data?.error || err.message || 'Failed to save item.');
        }
    };

    const handleItemInputChange = (event) => {
        const { name, value } = event.target;
        setEditingItem(prev => ({ ...prev, [name]: value }));
    };

    // --- Category Handlers ---
    const handleAddCategory = () => {
        console.log("[Category] Add clicked");
        setEditingCategory({ title: '', diagram_id: scheduleData?.id }); // New category template, needs diagram_id
        setShowCategoryEditModal(true);
        setApiError(null);
    };

    const handleEditCategory = (category) => {
        console.log("[Category] Edit clicked:", category);
        setEditingCategory({ ...category }); // Edit existing category
        setShowCategoryEditModal(true);
        setApiError(null);
    };

    const handleDeleteCategory = async (categoryId) => {
        console.log("[Category] Delete clicked:", categoryId);
        if (window.confirm('Are you sure you want to delete this category and ALL its items? This cannot be undone.')) {
            setApiError(null); // Clear previous main view errors
            try {
                await apiClient.delete(`/api/schedule_categories/${categoryId}`);
                onDataChange(); // Refresh data in parent
            } catch (err) {
                console.error("[Category] Error deleting:", err);
                setApiError(err.response?.data?.error || err.message || 'Failed to delete category.'); // Show error in main view
            }
        }
    };

     const handleCloseCategoryModal = () => {
        setShowCategoryEditModal(false);
        setEditingCategory(null);
        setApiError(null); // Clear modal-specific error on close
    };

    const handleSaveCategory = async (event) => {
        event.preventDefault();
        if (!editingCategory) {
             setApiError("Cannot save category: Missing category data.");
             return;
        }
        setApiError(null); // Clear previous modal errors

        const categoryData = {
            title: editingCategory.title,
            // diagram_id is needed for POST, should be present in editingCategory for PUT
            diagram_id: editingCategory.diagram_id || scheduleData?.id
        };

        // Basic validation
        if (!categoryData.title) {
            setApiError("Category title is required.");
            return;
        }
         if (!categoryData.diagram_id && !editingCategory.id) {
             setApiError("Cannot create category: Missing diagram ID.");
             console.error("Missing diagram_id for new category. scheduleData:", scheduleData);
             return;
         }


        try {
            if (editingCategory.id) { // Existing category -> PUT request
                console.log(`[Category] Saving existing ${editingCategory.id} with data:`, { title: categoryData.title }); // Only send title for update
                await apiClient.put(`/api/schedule_categories/${editingCategory.id}`, { title: categoryData.title });
            } else { // New category -> POST request
                console.log("[Category] Saving new with data:", categoryData);
                await apiClient.post('/api/schedule_categories', categoryData);
            }
            handleCloseCategoryModal();
            onDataChange(); // Refresh data in parent
        } catch (err) {
            console.error("[Category] Error saving:", err);
            // Display error within the modal
            setApiError(err.response?.data?.error || err.message || 'Failed to save category.');
        }
    };

     const handleCategoryInputChange = (event) => {
        const { name, value } = event.target;
        setEditingCategory(prev => ({ ...prev, [name]: value }));
    };

    // --- Diagram Title Handlers ---
    const handleEditTitleClick = () => {
        setCurrentDiagramTitle(scheduleData?.title || ''); // Load current title
        setIsEditingTitle(true);
        setTitleApiError(null); // Clear previous title errors
    };

    const handleCancelEditTitle = () => {
        setIsEditingTitle(false);
        setTitleApiError(null);
        // No need to reset setCurrentDiagramTitle, it gets reset on next edit click
    };

    const handleTitleInputChange = (event) => {
        setCurrentDiagramTitle(event.target.value);
    };

    const handleSaveTitle = async () => {
        if (!scheduleData?.id) {
            setTitleApiError("Cannot save title: Diagram ID is missing.");
            return;
        }
        setTitleApiError(null);
        try {
            console.log(`[Diagram Title] Saving diagram ${scheduleData.id} with title: "${currentDiagramTitle}"`);
            await apiClient.put(`/api/schedule_diagrams/${scheduleData.id}`, { title: currentDiagramTitle });
            setIsEditingTitle(false);
            onDataChange(); // Refresh parent data to get the updated title
        } catch (err) {
            console.error("[Diagram Title] Error saving:", err);
            setTitleApiError(err.response?.data?.error || err.message || 'Failed to save title.');
        }
    };

    // Update local title state if parent data changes (e.g., after save)
    // This prevents the old title flashing briefly if the component re-renders before onDataChange completes
    React.useEffect(() => {
        if (!isEditingTitle) {
            setCurrentDiagramTitle(scheduleData?.title || '');
        }
    }, [scheduleData?.title, isEditingTitle]);


    // --- Rendering Logic ---
    // Ensure scheduleData and categories exist before rendering
    const diagramId = scheduleData?.id; // Need the diagram ID for creating categories
    const categories = scheduleData?.categories || [];
    const monthName = scheduleData?.month ? scheduleData.month.charAt(0).toUpperCase() + scheduleData.month.slice(1) : 'Month';
    // Use state for title display if not editing, otherwise use scheduleData prop directly
    const displayTitle = isEditingTitle ? currentDiagramTitle : (scheduleData?.title || '');

    return (
        <Box sx={{ my: 2 }}>
            {/* Title Section with Inline Editing */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {isEditingTitle ? (
                    <TextField
                        value={currentDiagramTitle}
                        onChange={handleTitleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!titleApiError}
                        helperText={titleApiError}
                        sx={{ mr: 1 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Save Title">
                                        <IconButton onClick={handleSaveTitle} edge="end" size="small" color="primary">
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel Edit">
                                        <IconButton onClick={handleCancelEditTitle} edge="end" size="small">
                                            <CancelIcon />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                         <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0, mr: 1 }}>
                            {monthName} Schedule {displayTitle ? `(${displayTitle})` : ''}
                        </Typography>
                        {/* Show Edit Title button only if diagram exists */}
                        {diagramId && (
                            <Tooltip title="Edit Schedule Title">
                                <IconButton onClick={handleEditTitleClick} size="small">
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                )}

                {/* Add Category Button - Only show if diagram exists and not editing title */}
                {diagramId && !isEditingTitle && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCategory}
                        size="small"
                    >
                        Add Category
                    </Button>
                )}
            </Box>

            {/* Display general API errors here (e.g., from delete operations, excluding title errors) */}
            {apiError && !showItemEditModal && !showCategoryEditModal && !titleApiError && (
                 <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>
            )}

            {categories.length > 0 ? (
                <Grid container spacing={2} alignItems="stretch"> {/* Use alignItems="stretch" */}
                    {categories.map((cat) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                            <CategoryBucket
                                category={cat}
                                onAddItem={handleAddItem}
                                onEditItem={handleEditItem}
                                onDeleteItem={handleDeleteItem}
                                onEditCategory={handleEditCategory} // Pass down category handlers
                                onDeleteCategory={handleDeleteCategory} // Pass down category handlers
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No categories found for {monthName}. Add categories and items via Supabase or a future admin interface.
                </Alert>
            )}

            {/* Add/Edit Item Modal */}
            <Modal open={showItemEditModal} onClose={handleCloseItemModal}>
                <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 3, boxShadow: 24 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {editingItem?.id ? 'Edit Schedule Item' : 'Add New Schedule Item'}
                    </Typography>
                    {/* Display Item Modal specific errors here */}
                    {apiError && showItemEditModal && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
                    <Box component="form" onSubmit={handleSaveItem} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal" required fullWidth autoFocus
                            id="item-title" label="Title" name="title" // Unique ID
                            value={editingItem?.title || ''} onChange={handleItemInputChange}
                            error={apiError?.includes('Title')} // Basic error highlighting
                            helperText={apiError?.includes('Title') ? apiError : ''}
                        />
                        <TextField
                            margin="normal" fullWidth multiline rows={3}
                            id="item-description" label="Description" name="description" // Unique ID
                            value={editingItem?.description || ''} onChange={handleItemInputChange}
                        />
                        <TextField
                            margin="normal" fullWidth
                            id="item-cost" label="Cost (e.g., $500, TBD)" name="cost" // Unique ID
                            value={editingItem?.cost || ''} onChange={handleItemInputChange}
                        />
                         <FormControl fullWidth margin="normal">
                            <InputLabel id="item-status-label">Status</InputLabel>
                            <Select
                                labelId="item-status-label" id="item-status" name="status" // Unique ID
                                value={editingItem?.status || 'Planned'} label="Status"
                                onChange={handleItemInputChange}
                            >
                                <MenuItem value="Planned">Planned</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="On Hold">On Hold</MenuItem>
                            </Select>
                        </FormControl>
                         <TextField
                            margin="normal" fullWidth
                            id="item-due_date" label="Due Date" name="due_date" type="date" // Unique ID
                            // Format date for input type="date" (YYYY-MM-DD)
                            value={editingItem?.due_date ? new Date(editingItem.due_date).toISOString().split('T')[0] : ''}
                            onChange={handleItemInputChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCloseItemModal} sx={{ mr: 1 }}>Cancel</Button>
                            <Button type="submit" variant="contained">Save Item</Button>
                        </Box>
                    </Box>
                </Paper>
            </Modal>

             {/* Add/Edit Category Modal */}
             <Modal open={showCategoryEditModal} onClose={handleCloseCategoryModal}>
                <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 3, boxShadow: 24 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {editingCategory?.id ? 'Edit Category' : 'Add New Category'}
                    </Typography>
                     {/* Display Category Modal specific errors here */}
                    {apiError && showCategoryEditModal && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
                    <Box component="form" onSubmit={handleSaveCategory} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal" required fullWidth autoFocus
                            id="category-title" label="Category Title" name="title" // Unique ID
                            value={editingCategory?.title || ''} onChange={handleCategoryInputChange}
                            error={apiError?.includes('title')} // Basic error highlighting
                            helperText={apiError?.includes('title') ? apiError : ''}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCloseCategoryModal} sx={{ mr: 1 }}>Cancel</Button>
                            <Button type="submit" variant="contained">Save Category</Button>
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
}

export default MonthlyScheduleDiagram;
