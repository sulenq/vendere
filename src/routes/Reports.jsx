import React, { useState, useMemo } from 'react';

import ResponsiveNav from '../components/ResponsiveNav';

export default function Reports() {
  return (
    <div className="vendereApp">
      <ResponsiveNav active={'reports'} />
      <h1>reports Page</h1>
    </div>
  );
}
