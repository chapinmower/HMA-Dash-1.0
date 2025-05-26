import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Link } from '@mui/material';
import materials from '../marketing-materials.json'; // Import the generated list

function MarketingMaterials() {
  // The materials list is now imported from the generated JSON file

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marketing Materials
      </Typography>
      {materials.length > 0 ? (
        <List>
          {materials.map((material, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              {/* Use the download attribute to suggest saving the file */}
              <Link href={material.url} download={material.name} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                <ListItemText primary={material.name} />
              </Link>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>
          No marketing materials are currently available.
        </Typography>
      )}
    </Box>
  );
}

export default MarketingMaterials;
