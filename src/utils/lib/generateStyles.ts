import classnames from 'classnames';

type Sources = Record<string, string>[];

export function generateStyles(sources: Sources) {
  if (!sources.length) return {};
  const generatedStyles = sources
    .filter((source) => Boolean(source))
    .reduce((styles, styleSource) => {
      Object.keys(styleSource).forEach((key) => {
        styles[key] = classnames(styles[key], styleSource[key]);
      });
      return styles;
    }, {});
  return generatedStyles;
}
