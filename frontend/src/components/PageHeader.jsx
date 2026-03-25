export default function PageHeader({ title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <span className="section-eyebrow">Management</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
