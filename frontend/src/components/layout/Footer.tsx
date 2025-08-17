const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            © 2014 - {currentYear} Inspinia By <span className="fw-semibold">WebAppLayers</span> 
          </div>
          <div className="col-md-6">
            <div className="text-md-end d-none d-md-block">
              10GB of <span className="fw-bold">250GB</span> Free.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
