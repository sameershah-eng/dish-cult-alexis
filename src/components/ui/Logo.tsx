import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  withWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  glow = true,
  withWordmark = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 shrink-0 select-none ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Soft gradient glow ring behind logo (pulses softly) */}
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(229, 23, 63, 0.5) 0%, rgba(255, 90, 54, 0.25) 55%, transparent 100%)',
              transform: 'scale(1.28)',
              animationDuration: '3.5s',
            }}
          />
        )}

        {/* Circular Dish Cult Badge cropped to 0 0 295 295 */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 295 295"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:scale-105"
        >
          {/* White circle background */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M147.12 294.24C228.37 294.24 294.24 228.37 294.24 147.12C294.24 65.87 228.37 0 147.12 0C65.87 0 0 65.87 0 147.12C0 228.37 65.87 294.24 147.12 294.24Z"
            fill="white"
          />
          {/* Dish Cult black lettering */}
          <path d="M143.01 84.4H124.21V96.69H143.01V84.4Z" fill="black" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.52 130.11H64.09V96.06H58.52V84.23H90.79C107.27 84.23 121.56 90.23 121.56 112.69C121.56 130.43 112.14 141.94 88.35 141.94H58.52V130.11ZM80.72 130.4H86.61C97.36 130.4 103.8 124.63 103.8 113.09C103.8 101.55 97.36 95.77 86.61 95.77H80.72V130.4Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M172.05 118.14C166.59 116.7 161.12 116.3 161.12 112.92C161.12 111.24 162.41 109.31 165.46 109.31C167.18 109.28 168.86 109.79 170.28 110.75C171.54 111.63 172.47 112.91 172.93 114.37H182.09V103.2H173V105.61C170.35 103.04 165.77 101.92 162.16 101.92C153.32 101.92 146.89 106.74 146.89 115.98C146.89 123.69 152.44 126.5 157.98 127.98C163.52 129.46 168.8 130.11 169.06 132.83C169.32 135.55 167.7 136.25 164 136.25C162.44 136.16 160.94 135.66 159.64 134.8C158.59 133.94 157.72 132.89 157.06 131.7L156.61 130.95H142.91V103.2H119V114.61H126.66V131H122.16V142.41H156.59V140.41C159.45 142.54 162.92 143.69 166.48 143.7C175.39 143.7 182.94 140.01 182.94 130.2C183 122.24 177.51 119.59 172.05 118.14Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M181.66 84.4H202.23V107.7C206.32 104.33 211.71 101.92 217.09 101.92C228.18 101.92 230.03 107.22 230.03 113V131H234.68V142.41H213.32V119C213.32 114.18 210.5 113.37 208.09 113.37C205.68 113.37 202.23 114.18 202.23 119V131H206.81V142.41H181.5V131H186V95.81H181.66V84.4Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M101.44 168.69C100.54 167.85 99.53 167.13 98.44 166.56C90.98 162.55 81.68 165.36 77.67 172.82C76.53 174.94 75.91 177.31 75.85 179.72C75.85 190.94 84.52 195.24 90.98 195.24C97.44 195.24 101.13 193.05 103.16 188.66H121.63C119.63 204.98 108.29 212.09 91.31 211.92C70.31 211.73 58.51 198.66 58.51 179.63C58.51 161.63 68.8 147.35 88.7 147.35C94.04 147.35 98.6 148.84 102.1 153.22H102.28V148.75H121L120.44 168.69H101.44Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M155.78 206.73C150.95 210.94 146.03 211.92 139.54 211.92C130.68 211.92 126.38 209.19 126.38 200.77V181.77H123V169.28H144.59V194.68C144.59 198.28 145.3 200.59 149.16 200.59C155.56 200.59 155.56 197.09 155.56 191.21V181.73H151.69V169.28H173.28V199.63H177.28V212.09H155.78V206.73Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M179.51 148.75H202.58V199.63H209.14V212.09H180.25V199.63H184.86V161.21H179.51V148.75Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M229.78 169.12H235.78V181.57H229.78V194.57C229.78 197.99 230.66 198.51 233.2 198.51H235.75V211.93H223.89C216.89 211.93 212.06 208.69 212.06 201.76V181.57H207.06V169.12H212.06V153.5H229.78V169.12Z"
            fill="black"
          />
          <path
            d="M147.12 277.8C219.29 277.8 277.8 219.3 277.81 147.13C277.81 74.9599 219.31 16.4499 147.14 16.4399C74.9699 16.4299 16.4599 74.9399 16.4499 147.11C16.4499 219.28 74.9499 277.78 147.12 277.79V277.8ZM147.12 285.8C70.5299 285.8 8.43994 223.71 8.43994 147.12C8.43994 70.5299 70.5299 8.43994 147.12 8.43994C223.71 8.43994 285.8 70.5299 285.8 147.12C285.8 223.71 223.73 285.79 147.14 285.8H147.12Z"
            fill="black"
          />
        </svg>
      </div>

      {withWordmark && (
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-cream whitespace-nowrap">
          Dish Cult
        </span>
      )}
    </div>
  );
};
