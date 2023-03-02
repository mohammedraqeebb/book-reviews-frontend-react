export const getListVariants = (staggerTime: number) => {
  const listVariants = {
    visible: {
      transition: { staggerChildren: 0.1 },
    },
    hidden: {},
  };

  return listVariants;
};

export const getListItemVariants = (x: number, horizontal: boolean = false) => {
  if (horizontal) {
    const listItemVariants = {
      visible: {
        opacity: 1,
        x: 0,
      },
      hidden: {
        opacity: 0,
        x: x,
      },
    };
    return listItemVariants;
  }
  const listItemVariants = {
    visible: {
      opacity: 1,
      y: 0,
    },
    hidden: {
      opacity: 0,
      y: x,
    },
  };
  return listItemVariants;
};
