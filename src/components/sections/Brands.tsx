const brands = ["mindray", "OMRON", "yuwell 鱼跃", "CONTEC", "B. BRAUN", "PHILIPS", "3M", "Dräger"];
export function Brands() { return <section id="thuong-hieu" className="section brands"><div className="section-heading"><h2>Thương hiệu đối tác</h2></div><div className="brand-row">{brands.map((brand) => <span key={brand}>{brand}</span>)}</div></section>; }
