import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Link, 
  Divider, 
  Paper, 
  Chip,
  IconButton,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TableChartIcon from '@mui/icons-material/TableChart';
import EmailIcon from '@mui/icons-material/Email';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import materials from '../marketing-materials.json'; // Import the generated list

function MarketingMaterials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Get unique categories from materials
  const categories = ['All', ...new Set(materials.map(item => item.category))];

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'PDF Document':
        return <PictureAsPdfIcon />;
      case 'Word Document':
        return <DescriptionIcon />;
      case 'PowerPoint Presentation':
        return <SlideshowIcon />;
      case 'Excel Spreadsheet':
        return <TableChartIcon />;
      case 'Email':
        return <EmailIcon />;
      case 'Markdown Document':
        return <ArticleIcon />;
      case 'Image':
        return <ImageIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  // Filter materials based on search term and category
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || material.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group materials by category for display
  const materialsByCategory = filteredMaterials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marketing Materials
      </Typography>
      <Typography variant="body1" paragraph>
        Access and download marketing collateral, presentations, and documents.
      </Typography>

      {/* Search and Filter Bar */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, border: '1px solid #e0e0e0', borderRadius: 1, px: 2 }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          <InputBase
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {materials.length > 0 ? (
        <>
          {/* If filtered results are empty */}
          {filteredMaterials.length === 0 && (
            <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
              No materials match your search criteria.
            </Typography>
          )}

          {/* Display materials grouped by category */}
          {Object.entries(materialsByCategory).map(([category, items]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: '#105938' }}>
                {getCategoryIcon(category)}
                <Box component="span" sx={{ ml: 1 }}>{category}</Box>
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {items.map((material, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 3,
                          bgcolor: '#f9f9f9'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: 'primary.main', mr: 1 }}>
                          {getCategoryIcon(material.category)}
                        </Box>
                        <Typography variant="subtitle1" noWrap title={material.name}>
                          {material.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <IconButton 
                          component={Link}
                          href={material.url} 
                          download={material.fileName}
                          target="_blank" 
                          rel="noopener noreferrer"
                          color="primary"
                          title={`Download ${material.name}`}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </>
      ) : (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>
          No marketing materials are currently available.
        </Typography>
      )}
    </Box>
  );
}

export default MarketingMaterials;
