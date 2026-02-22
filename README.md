# Found Footage Archive - Portfolio Website

A dark, cinematic portfolio website for showcasing eerie AI-generated "found footage" videos and liminal space pictures with an analog horror aesthetic.

## 🎬 Features

- **Dark VHS Aesthetic**: Grain overlay, glitch effects, and analog horror styling
- **3D Parallax Hover**: Dynamic card tilting based on mouse position
- **SPA Architecture**: Smooth tab switching between Videos and Pictures
- **Dynamic Content**: Fetches media from Google Apps Script JSON API
- **Video Controls**: Auto-play on hover, pause on leave
- **Responsive Design**: Mobile-friendly grid layout
- **Kinetic Typography**: Glitch effects and animated headers

## 📁 Project Structure

```
found-footage-portfolio/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with animations
├── script.js           # Dynamic rendering and API logic
└── README.md           # Documentation
```

## 🚀 Setup Instructions

### 1. API Configuration

Open `script.js` and replace the placeholder API URL:

```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_API_URL_HERE';
```

### 2. Expected API Response Format

Your Google Apps Script should return JSON in this exact structure:

```json
{
  "videos": [
    {
      "title": "TAPE_001_BASEMENT",
      "url": "https://drive.google.com/uc?export=download&id=FILE_ID"
    }
  ],
  "pictures": [
    {
      "title": "IMG_001_LIMINAL",
      "url": "https://drive.google.com/uc?export=download&id=FILE_ID"
    }
  ]
}
```

### 3. Google Drive Direct Links

For Google Drive files, use this URL format:
```
https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
```

### 4. Local Testing

Simply open `index.html` in a modern browser. The site includes mock data for testing without an API.

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --bg-dark: #0a0a0a;
    --accent-red: #ff0033;
    --accent-green: #00ff41;
}
```

### Fonts
Current fonts (via Google Fonts):
- **Bebas Neue**: Headers and titles
- **Roboto Mono**: Body text and metadata

### 3D Parallax Intensity
Adjust tilt angle in `script.js`:
```javascript
const rotateX = (y - centerY) / centerY * -10; // Change 10 to desired max degrees
const rotateY = (x - centerX) / centerX * 10;
```

## 🔧 Technical Details

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Performance
- Lazy loading for images
- CSS animations with GPU acceleration
- Efficient DOM manipulation

### Accessibility
- Respects `prefers-reduced-motion`
- Semantic HTML structure
- Keyboard navigation support

## 📝 Google Apps Script Example

```javascript
function doGet() {
  const videos = DriveApp.getFolderById('FOLDER_ID').getFilesByType(MimeType.MP4);
  const pictures = DriveApp.getFolderById('FOLDER_ID').getFilesByType(MimeType.JPEG);
  
  const data = {
    videos: [],
    pictures: []
  };
  
  while (videos.hasNext()) {
    const file = videos.next();
    data.videos.push({
      title: file.getName(),
      url: `https://drive.google.com/uc?export=download&id=${file.getId()}`
    });
  }
  
  while (pictures.hasNext()) {
    const file = pictures.next();
    data.pictures.push({
      title: file.getName(),
      url: `https://drive.google.com/uc?export=download&id=${file.getId()}`
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🎯 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in Settings
3. Select main branch as source

### Netlify
1. Drag and drop the folder to Netlify
2. Site deploys automatically

### Custom Server
Upload all files to your web server root directory.

## 📄 License

Free to use for personal and commercial projects.

## 🆘 Troubleshooting

**Videos not playing?**
- Check CORS settings on your API
- Ensure video URLs are direct links
- Verify browser supports video format

**API not loading?**
- Check browser console for errors
- Verify API URL is correct
- Test API endpoint directly in browser

**3D effect not working?**
- Ensure JavaScript is enabled
- Check browser supports CSS 3D transforms
- Clear browser cache

---

**Created with ❤️ for analog horror enthusiasts**
