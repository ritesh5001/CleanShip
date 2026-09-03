const { UtilityBar, SiteHeader, SiteFooter } = window.CS_DS;

function App() {
  const [page, setPage] = React.useState("Home");
  const go = p => { setPage(p); window.scrollTo({ top: 0 }); };
  const Body = { Home, Services: ServicesPage, "About Us": AboutPage, "Contact Us": ContactPage, Project: ServicesPage }[page] || Home;
  return (
    <div>
      <UtilityBar />
      <SiteHeader active={page} onNavigate={go} ctaLabel="Get a quote" />
      <Body onNavigate={go} />
      <SiteFooter />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
