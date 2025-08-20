import React from 'react';
import Layout from '../../components/layout/Layout';

const SystemSettings: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">System Settings</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item active">Settings</li>
          </ol>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#general" role="tab">
                    <i className="ti ti-settings me-1"></i>
                    General
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#security" role="tab">
                    <i className="ti ti-shield me-1"></i>
                    Security
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#email" role="tab">
                    <i className="ti ti-mail me-1"></i>
                    Email
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#integrations" role="tab">
                    <i className="ti ti-plug me-1"></i>
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                {/* General Settings */}
                <div className="tab-pane active" id="general" role="tabpanel">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Platform Name</label>
                        <input type="text" className="form-control" defaultValue="Tedara" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Platform URL</label>
                        <input type="url" className="form-control" defaultValue="https://tedara.com" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Default Language</label>
                        <select className="form-select">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Timezone</label>
                        <select className="form-select">
                          <option>UTC</option>
                          <option>EST</option>
                          <option>PST</option>
                          <option>GMT</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Maintenance Mode</label>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="maintenanceMode" />
                          <label className="form-check-label" htmlFor="maintenanceMode">
                            Enable maintenance mode
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Debug Mode</label>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="debugMode" />
                          <label className="form-check-label" htmlFor="debugMode">
                            Enable debug mode
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Auto Updates</label>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="autoUpdates" defaultChecked />
                          <label className="form-check-label" htmlFor="autoUpdates">
                            Enable automatic updates
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="tab-pane" id="security" role="tabpanel">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <input type="number" className="form-control" defaultValue="30" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password Policy</label>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="requireUppercase" defaultChecked />
                          <label className="form-check-label" htmlFor="requireUppercase">
                            Require uppercase letters
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="requireNumbers" defaultChecked />
                          <label className="form-check-label" htmlFor="requireNumbers">
                            Require numbers
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="requireSymbols" />
                          <label className="form-check-label" htmlFor="requireSymbols">
                            Require special characters
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Two-Factor Authentication</label>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="twoFactor" defaultChecked />
                          <label className="form-check-label" htmlFor="twoFactor">
                            Enable 2FA for admins
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">IP Whitelist</label>
                        <textarea className="form-control" rows={3} placeholder="Enter IP addresses (one per line)"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Settings */}
                <div className="tab-pane" id="email" role="tabpanel">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">SMTP Host</label>
                        <input type="text" className="form-control" defaultValue="smtp.gmail.com" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">SMTP Port</label>
                        <input type="number" className="form-control" defaultValue="587" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">SMTP Username</label>
                        <input type="email" className="form-control" defaultValue="noreply@tedara.com" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">SMTP Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Encryption</label>
                        <select className="form-select">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary">Test Email Configuration</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrations Settings */}
                <div className="tab-pane" id="integrations" role="tabpanel">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Payment Gateway</h6>
                          <div className="mb-3">
                            <label className="form-label">Stripe API Key</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">PayPal Client ID</label>
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Analytics</h6>
                          <div className="mb-3">
                            <label className="form-label">Google Analytics ID</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Facebook Pixel ID</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary">Save Settings</button>
              <button className="btn btn-secondary ms-2">Reset to Default</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;
