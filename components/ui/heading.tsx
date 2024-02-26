type HeadingType = {
  title: string;
  description: string;
};

const Heading = ({ title, description }: HeadingType) => {
  return (
    <div>
      <h2 className="font-black text-xl tracking-tight  capitalize">{title}</h2>
      <p className="text-sm text-muted-foreground capitalize">{description}</p>
    </div>
  );
};

export default Heading;
