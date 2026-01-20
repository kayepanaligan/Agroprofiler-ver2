<div className="heatmap-container">
    <div className="select-container mb-10 grid lg:grid-flow-row lg:grid-rows-1 md:grid-flow-col md:grid-cols-2 gap-4">
        <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border-slate-400 dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] rounded-xl cursor-pointer focus:border-green-500 sm:text-[14px]"
        >
            <option value="allocations">Allocations</option>
            <option value="commodities">Commodities</option>
            <option value="farmers">Farmers</option>
        </select>

        {view === "commodities" && (
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
            >
                <option value="All">All Categories</option>
                {Object.keys(categories).map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                        {categoryName}
                    </option>
                ))}
            </select>
        )}

        {view === "commodities" && category !== "All" && (
            <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="rounded-[12px] dark:text-white dark:border-green-700 dark:border-[2px] p-2 px-4 dark:bg-[#0D1A25] border-slate-500 cursor-pointer focus:border-green-500 sm:text-[14px]"
            >
                <option value="All">All Commodities</option>
                {categories[category].map((commodity) => (
                    <option key={commodity} value={commodity}>
                        {commodity}
                    </option>
                ))}
            </select>
        )}
    </div>

    {hoveredBarangay && (
        <div className="hover-info">
            <p>
                <strong>{hoveredBarangay.name}</strong>:{" "}
                {hoveredBarangay.value ?? "No Data"}
            </p>
        </div>
    )}

    <MapContainer
        ref={mapRef}
        center={[6.75, 125.35]}
        scrollWheelZoom={true}
        zoom={12}
        style={{
            width: "100%",
            height: "500px",
            zIndex: "10",
            borderRadius: "0.5rem",
            backgroundColor: "transparent",
        }}
        className="dark:bg-black"
    >
        {geoData && (
            <GeoJSON
                key={view + subtype}
                data={geoData}
                style={style}
                onEachFeature={(feature: any, layer: any) => {
                    layer.on({
                        click: () => {
                            const barangayName =
                                feature.properties.NAME_2.replace(/\s+/g, "");
                            const data = heatmapData[barangayName];
                            alert(JSON.stringify(data));
                        },
                        mouseover: () => {
                            const barangayName =
                                feature.properties.NAME_2.replace(/\s+/g, "");
                            const value =
                                calculatePercentageIntensity(barangayName);
                            setHoveredBarangay({ name: barangayName, value });
                            layer.setStyle({ weight: 3, color: "blue" });
                        },
                        mouseout: () => {
                            setHoveredBarangay(null);
                            layer.setStyle({ weight: 2, color: "black" });
                        },
                    });
                }}
            />
        )}
    </MapContainer>
</div>;
