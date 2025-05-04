const Title = (props: { mainTitle: string; subTitle: string }) => {
  const { mainTitle, subTitle, ...prop } = props;

  return (
    <div {...prop}>
      <h1>{mainTitle}</h1>
      <h1 className="pb-6 text-emerald-500">{subTitle}</h1>
    </div>
  );
};

export { Title };
