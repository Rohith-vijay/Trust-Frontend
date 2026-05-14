function SiteContainer({ children }) {
  return (
    <div className="bg-gray-50">

      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>

    </div>
  );
}

export default SiteContainer;
