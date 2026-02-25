import React, { useState, useRef } from 'react';
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

const MAX_IMAGES = 4;

export default function AddListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [AiDescription, setAiDescription] = useState('');

  // ── IMAGE STATE (up to 4 images) ───────────────────────────────────────────
  const [imageFiles, setImageFiles] = useState([]);       // Array of File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Array of Object URLs
  // ───────────────────────────────────────────────────────────────────────────

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

  // ── FILE UPLOAD HANDLERS (multi-image, max 4) ──────────────────────────────
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const remaining = MAX_IMAGES - imageFiles.length;
    const filesToAdd = selectedFiles.slice(0, remaining);

    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...filesToAdd]);
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Reset input so same files can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!formData.title || !formData.location) return;

    const Timer = setTimeout(async () => {
      const response = await fetch('http://localhost:5000/api/generateDescription', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Title: ${formData.title}`,
          location: `Location: ${formData.location}`
        })
      });
      const res = await response.json();
      console.log(res.description);
      setAiDescription(res.description);
    }, 6000);

    return () => clearTimeout(Timer);
  }, [formData.title, formData.location]);

  useEffect(() => {
    if (!AiDescription) return;
    const content = AiDescription.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setFormData(prev => ({
        ...prev,
        description: content.slice(0, idx + 1).join(" ")
      }));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 100);
  }, [AiDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const required = [
      'title', 'description', 'price', 'location', 'country',
      'hostName', 'propertyType', 'rooms', 'bathrooms', 'maxGuests',
      'checkIn', 'checkOut',
    ];
    const missing = required.filter(f => !formData[f]);

    if (missing.length || imageFiles.length === 0) {
      setError(
        imageFiles.length === 0
          ? 'Please upload at least one property image'
          : 'Please fill in all required fields'
      );
      setLoading(false);
      return;
    }

    console.log(formData, imageFiles);

    const payload = new FormData();

    // Append all images
    imageFiles.forEach((file, index) => {
      payload.append('images', file);
    });

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

    console.log(payload);

    try {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Add New Listing
        </Typography>

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
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth required
                  label="Property Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {AiDescription && formData.description === AiDescription && (
                  <Chip
                    label="AI generated"
                    size="small"
                    color="secondary"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth required multiline rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Price per Night ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Location / City"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating (1-5)"
                name="rating"
                type="number"
                inputProps={{ min: 1, max: 5, step: 0.1 }}
                value={formData.rating}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* ── Image Upload (up to 4) ────────────────────────────────── */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Property Images * <Typography component="span" variant="body2" color="text.secondary">(up to {MAX_IMAGES})</Typography>
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Hidden native file input — multiple allowed */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Existing image previews */}
            {imagePreviews.map((preview, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                  <Box
                    component="img"
                    src={preview}
                    alt={`Property image ${index + 1}`}
                    sx={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute', top: 4, right: 4,
                      minWidth: 0, px: 1, py: 0.25, fontSize: '0.7rem'
                    }}
                  >
                    ✕
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', p: 0.5, bgcolor: '#f5f5f5', noWrap: true }}>
                    {imageFiles[index]?.name}
                  </Typography>
                </Box>
              </Grid>
            ))}

            {/* Add more slot — shown if under the limit */}
            {imageFiles.length < MAX_IMAGES && (
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    height: 155, width: '100%',
                    borderStyle: 'dashed',
                    flexDirection: 'column',
                    gap: 1,
                    color: 'text.secondary'
                  }}
                >
                  <Typography variant="h4" lineHeight={1}>+</Typography>
                  <Typography variant="caption">
                    {imageFiles.length === 0
                      ? 'Upload Images'
                      : `Add More (${imageFiles.length}/${MAX_IMAGES})`}
                  </Typography>
                </Button>
              </Grid>
            )}
          </Grid>

          {/* ── Host Information ──────────────────────────────────────── */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Host Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Host Name"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Host Experience"
                name="hostExperience"
                value={formData.hostExperience}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Host Contact"
                name="hostContact"
                value={formData.hostContact}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* ── Property Details ──────────────────────────────────────── */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Property Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  label="Property Type"
                  onChange={handleChange}
                >
                  {PROPERTY_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Number of Rooms"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Number of Bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Max Guests"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* ── Amenities ─────────────────────────────────────────────── */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Amenities
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
            {AMENITY_OPTIONS.map(amenity => (
              <Chip
                key={amenity}
                label={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          {formData.amenities.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected: {formData.amenities.join(', ')}
            </Typography>
          )}

          {/* ── Rules & Policies ──────────────────────────────────────── */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Rules & Policies
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Check-In Time"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                label="Check-Out Time"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="petsAllowed"
                    checked={formData.petsAllowed}
                    onChange={handleChange}
                  />
                }
                label="Pets Allowed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="smokingAllowed"
                    checked={formData.smokingAllowed}
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
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </Stack>

        </Box>
      </Paper>
    </Container>
  );
}