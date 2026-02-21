import React, { useState, useRef, use } from 'react';
import {
  Box, Container, Paper, TextField, Button, Typography, Grid,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel,
  Checkbox, Chip, Stack, Divider, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../PropertyDetails/AuthContext';
import './AddListing.css';
import { useEffect } from 'react';


const AMENITY_OPTIONS = [
  'WiFi', 'Air Conditioning', 'Heating', 'Kitchen', 'Washer', 'Dryer',
  'TV', 'Parking', 'Pool', 'Gym', 'Hot Tub', 'Fireplace', 'Balcony',
  'Garden', 'Pet Friendly', 'Smoking Allowed', 'Breakfast Included',
  'Room Service', '24/7 Front Desk', 'Elevator'
];

const PROPERTY_TYPES = [
  'Villa', 'Apartment', 'Room', 'Private Room', 'Luxury Apartment',
  'House', 'Condo', 'Studio', 'Cabin', 'Loft'
];

export default function AddListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [AiDescription, setAiDescription] = useState('');
  // ── IMAGE STATE ──────────────────────────────────────────────────────────────
  const [imageFile, setImageFile] = useState(null);       // File object
  const [imagePreview, setImagePreview] = useState('');   // Object URL for preview
  // ─────────────────────────────────────────────────────────────────────────────

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    rating: 4,
    hostName: user?.name || '',
    hostExperience: '',
    hostContact: '',
    propertyType: '',
    rooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    checkIn: '',
    checkOut: '',
    petsAllowed: false,
    smokingAllowed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // ── FILE UPLOAD HANDLERS ─────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revoke previous object URL to avoid memory leaks
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
    // Reset the hidden input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  useEffect(() => {
    //   console.log("Form data changed:", formData);
    if (!formData.title || !formData.location) {
      return;
    }

    const Timer = setTimeout(async () => {
      const response = await fetch('http://localhost:5000/api/generateDescription', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: `Title: ${formData.title}`,
          location: `Location: ${formData.location}`
        })
      })
      const res = await response.json()
      console.log(res.description);
      setAiDescription(res.description)
    }, 6000)
    return () => clearTimeout(Timer)

  }, [formData.title, formData.location])

  useEffect(() => {
    if (!AiDescription) return; // Guard: don't start animation if description is empty
    const content = AiDescription.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setFormData(prev => ({
        ...prev,
        description: content.slice(0, idx + 1).join(" ")
      }));

      idx++;

      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 100)
  }, [AiDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validation
    const required = [
      'title', 'description', 'price', 'location', 'country',
      'hostName', 'propertyType', 'rooms', 'bathrooms',
      'maxGuests', 'checkIn', 'checkOut',
    ];
    const missing = required.filter(f => !formData[f]);
    if (missing.length || !imageFile) {
      setError(
        !imageFile
          ? 'Please upload a property image'
          : 'Please fill in all required fields'
      );
      setLoading(false);
      return;
    }

    console.log(formData, imageFile)

    // Build multipart/form-data so the file is sent correctly
    const payload = new FormData();
    payload.append('image', imageFile);             // actual file
    payload.append('imageFilename', imageFile.name); // original filename

    // Append all other fields (flatten nested objects as JSON strings)
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('price', parseFloat(formData.price));
    payload.append('location', formData.location.trim());
    payload.append('country', formData.country.trim());
    payload.append('rating', parseFloat(formData.rating) || 4);

    payload.append('host', JSON.stringify({
      name: formData.hostName.trim(),
      experience: formData.hostExperience.trim() || undefined,
      contact: formData.hostContact.trim() || undefined,
    }));

    payload.append('hotelDetails', JSON.stringify({
      type: formData.propertyType,
      rooms: parseInt(formData.rooms),
      bathrooms: parseInt(formData.bathrooms),
      maxGuests: parseInt(formData.maxGuests),
    }));

    payload.append('amenities', JSON.stringify(formData.amenities));

    payload.append('hotelRules', JSON.stringify({
      checkIn: formData.checkIn.trim(),
      checkOut: formData.checkOut.trim(),
      petsAllowed: formData.petsAllowed,
      smokingAllowed: formData.smokingAllowed,
    }));

    console.log(payload)


    try {
      // ⚠️  Do NOT set Content-Type manually — the browser sets it automatically
      //     (with the correct boundary) when you pass a FormData body.
      const response = await fetch('http://localhost:5000/api/addListing', {
        method: 'POST',
        credentials: 'include',
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create listing');

      setSuccess(true);
      setTimeout(() => navigate('/host/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the listing');
    } finally {
      setLoading(false);
    }
  };



  return (

    <Container className="add-listing-wrapper" maxWidth="md" sx={{ py: 4 }}>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Add New Listing</Typography>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Listing created successfully! Redirecting to dashboard...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>

          {/* ── Basic Information ─────────────────────────────────────── */}
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth required
                label="Title" name="title"
                value={formData.title} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              {AiDescription && formData.description === AiDescription && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <span style={{ marginRight: 6 }} title="AI generated">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#FFD600" strokeWidth="2" fill="#FFF9C4" />
                      <path d="M12 7v5" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="16" r="1" fill="#FFD600" />
                    </svg>
                  </span>
                  <Typography variant="caption" color="warning.main">
                    AI generated
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth required multiline rows={4}
                label="Description" name="description" className='description'
                value={formData.description} onChange={handleChange}
              />
            </Grid>

            {/* ── Image Upload ─────────────────────────────────────────── */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Property Image *
              </Typography>

              {/* Hidden native file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Preview or upload button */}
              {imagePreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%', maxWidth: 400, maxHeight: 240,
                      objectFit: 'cover', borderRadius: 2,
                      border: '1px solid #e0e0e0', display: 'block',
                    }}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small" variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                    <Button
                      size="small" variant="outlined" color="error"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {imageFile?.name}
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ height: 80, width: '100%', borderStyle: 'dashed' }}
                >
                  Click to Upload Image
                </Button>
              )}
            </Grid>
            {/* ─────────────────────────────────────────────────────────── */}

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Price per night ($)" name="price" type="number"
                value={formData.price} onChange={handleChange}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Location" name="location"
                value={formData.location} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Country" name="country"
                value={formData.country} onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* ── Host Information ──────────────────────────────────────── */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Host Information</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Host Name" name="hostName"
                value={formData.hostName} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Experience (e.g. 5 years)" name="hostExperience" type='number'
                value={formData.hostExperience} onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact"
                name="hostContact"
                type="tel"
                value={formData.hostContact}
                onChange={handleChange}
                inputProps={{
                  minLength: 10,
                  maxLength: 10,
                  pattern: "[0-9]{10}"
                }}
                required
              />
            </Grid>
          </Grid>

          {/* ── Property Details ──────────────────────────────────────── */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Property Details</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Property Type</InputLabel>
                <Select
                  label="Property Type" name="propertyType"
                  value={formData.propertyType} onChange={handleChange}
                >
                  {PROPERTY_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth required
                label="Rooms" name="rooms" type="number"
                value={formData.rooms} onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth required
                label="Bathrooms" name="bathrooms" type="number"
                value={formData.bathrooms} onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth required
                label="Max Guests" name="maxGuests" type="number"
                value={formData.maxGuests} onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          {/* ── Amenities ─────────────────────────────────────────────── */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Amenities</Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {AMENITY_OPTIONS.map(amenity => (
              <Chip
                key={amenity}
                label={amenity}
                clickable
                onClick={() => handleAmenityToggle(amenity)}
                color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          {formData.amenities.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Selected: {formData.amenities.join(', ')}
            </Typography>
          )}

          {/* ── Rules & Policies ──────────────────────────────────────── */}
          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Rules & Policies</Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Check-in Time" name="checkIn"
                value={formData.checkIn} onChange={handleChange}
                placeholder="e.g. 3:00 PM"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth required
                label="Check-out Time" name="checkOut"
                value={formData.checkOut} onChange={handleChange}
                placeholder="e.g. 11:00 AM"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="petsAllowed" checked={formData.petsAllowed}
                    onChange={handleChange}
                  />
                }
                label="Pets Allowed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="smokingAllowed" checked={formData.smokingAllowed}
                    onChange={handleChange}
                  />
                }
                label="Smoking Allowed"
              />
            </Grid>
          </Grid>

          {/* ── Submit ────────────────────────────────────────────────── */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </Stack>

        </Box>
      </Paper>
    </Container>
  );
}