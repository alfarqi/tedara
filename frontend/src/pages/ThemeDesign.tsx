import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import theme1Image from '../assets/themes/theme1.png';
import theme2Image from '../assets/themes/theme2.png';
import theme3Image from '../assets/themes/theme3.png';

interface Theme {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  features: string[];
  downloadUrl: string;
  previewUrl: string;
}

const ThemeDesign: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const themes: Theme[] = [
    {
      id: '1',
      name: 'Taif',
      description: 'Modern eyewear e-commerce theme with sleek design and mobile responsiveness',
      image: theme1Image,
      category: 'Electronics',
      features: ['Responsive Design', 'Mobile Optimized', 'Modern UI'],
      downloadUrl: '#',
      previewUrl: '#'
    },
    {
      id: '2',
      name: 'Fakhr',
      description: 'Elegant jewelry and fashion theme with beautiful product showcases',
      image: theme2Image,
      category: 'Jewelry',
      features: ['Product Gallery', 'Shopping Cart', 'Payment Integration'],
      downloadUrl: '#',
      previewUrl: '#'
    },
    {
      id: '3',
      name: 'Betsy',
      description: 'Pet store theme with warm colors and pet-friendly design elements',
      image: theme3Image,
      category: 'Home',
      features: ['Pet Categories', 'Product Reviews', 'Customer Support'],
      downloadUrl: '#',
      previewUrl: '#'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'ti ti-hash' },
    { id: 'electronics', name: 'Electronics', icon: 'ti ti-device-desktop' },
    { id: 'home', name: 'Home Supplies', icon: 'ti ti-home' },
    { id: 'fashion', name: 'Fashion', icon: 'ti ti-hanger' },
    { id: 'jewelry', name: 'Jewelry', icon: 'ti ti-watch' },
    { id: 'beauty', name: 'Beauty & Care', icon: 'ti ti-crown' },
    { id: 'accessories', name: 'Accessories & Gifts', icon: 'ti ti-gift' },
    { id: 'arts', name: 'Arts & Music', icon: 'ti ti-photo' },
    { id: 'books', name: 'Books & Education', icon: 'ti ti-book' },
    { id: 'services', name: 'Services', icon: 'ti ti-handshake' }
  ];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'electronics' && theme.category === 'Electronics') ||
                           (selectedCategory === 'jewelry' && theme.category === 'Jewelry') ||
                           (selectedCategory === 'home' && theme.category === 'Home');
    return matchesSearch && matchesCategory;
  });

  const handleActivate = (themeId: string) => {
    // In a real application, this would activate the theme
    console.log(`Activating theme ${themeId}`);
    alert(`Activating ${themes.find(t => t.id === themeId)?.name} theme...`);
  };

  const handlePreview = (themeId: string) => {
    // In a real application, this would open a preview
    console.log(`Previewing theme ${themeId}`);
    alert(`Opening preview for ${themes.find(t => t.id === themeId)?.name} theme...`);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Theme Design</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Theme Design</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row px-4">
        <div className="col-12">
          {/* Search Section */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="app-search">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search themes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="ti ti-search app-search-icon text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse Themes by Sector Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="mb-0 fw-bold">Browse Themes by Sector</h5>
          </div>

          {/* Category Filter Buttons */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`btn btn-sm d-flex align-items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ borderRadius: '20px' }}
                >
                  <i className={category.icon}></i>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Themes Grid */}
          <div className="row">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body p-0">
                    {/* Theme Image */}
                    <div className="position-relative">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="card-img-top"
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-success">Free</span>
                      </div>
                    </div>

                    {/* Theme Content */}
                    <div className="p-3">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="card-title mb-0">{theme.name}</h5>
                        <span className="badge bg-soft-primary text-primary">{theme.category}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary flex-fill"
                          onClick={() => handleActivate(theme.id)}
                        >
                          <i className="ti ti-check me-1"></i>
                          Activate Theme
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handlePreview(theme.id)}
                        >
                          <i className="ti ti-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredThemes.length === 0 && (
            <div className="text-center py-5">
              <i className="ti ti-search fs-48 text-muted mb-3"></i>
              <h5 className="text-muted">No themes found</h5>
              <p className="text-muted">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThemeDesign;
