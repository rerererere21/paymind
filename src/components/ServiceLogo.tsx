'use client';

import React from 'react';

interface Props {
name: string;
color: string;
size?: number;
}

export default function ServiceLogo({ name, color, size = 32 }: Props) {
const key = (name || '').toLowerCase();

let src = '';

if (key.includes('netflix')) src = '/logos/netflix.png';
else if (key.includes('spotify')) src = '/logos/spotify.png';
else if (key.includes('youtube')) src = '/logos/youtube.png';
else if (key.includes('disney')) src = '/logos/disney.png';
else if (key.includes('shahid')) src = '/logos/shahid.png';
else if (key.includes('stc')) src = '/logos/stc.png';
else if (key.includes('apple')) src = '/logos/apple-music.png';
else if (key.includes('icloud')) src = '/logos/icloud.png';
else if (key.includes('adobe')) src = '/logos/adobe.png';

if (src) {
return (
<img
src={src}
alt={name}
width={size}
height={size}
style={{ minWidth: size, objectFit: 'contain', display: 'block' }}
/>
);
}

return (
<div
style={{
width: size,
height: size,
minWidth: size,
backgroundColor: color,
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
color: 'white',
fontWeight: 700,
}}
>
{name?.charAt(0) || '?'} </div>
);
}






