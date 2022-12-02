import React from 'react';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div className="OptionsContainer bg-slate-400">{title} Page</div>;
};

export default Options;
