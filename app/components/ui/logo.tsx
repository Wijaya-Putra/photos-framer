// app/components/ui/Logo.tsx
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="Back to Homepage">
      <svg
        width="28"
        height="28"
        viewBox="0 0 52 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-slate-800 group-hover:text-blue-600 transition-colors"
      >
        <rect x="0.5" y="0.5" width="51" height="51" fill="#F8F9FA"/>
        <rect x="0.5" y="0.5" width="51" height="51" stroke="currentColor"/>
        <g filter="url(#filter0_d_2034_144)">
        <path d="M11.3063 46.3636V19.3636H14.2211V22.483H14.579C14.8006 22.142 15.1074 21.7074 15.4995 21.179C15.9 20.642 16.4711 20.1648 17.2125 19.7472C17.9625 19.321 18.9767 19.108 20.2551 19.108C21.9086 19.108 23.3659 19.5213 24.6273 20.348C25.8887 21.1747 26.873 22.3466 27.5804 23.8636C28.2878 25.3807 28.6415 27.1705 28.6415 29.233C28.6415 31.3125 28.2878 33.1151 27.5804 34.6406C26.873 36.1577 25.8929 37.3338 24.6401 38.169C23.3873 38.9957 21.9426 39.4091 20.3063 39.4091C19.0449 39.4091 18.035 39.2003 17.2765 38.7827C16.5179 38.3565 15.9341 37.875 15.525 37.3381C15.1159 36.7926 14.8006 36.3409 14.579 35.983H14.3233V46.3636H11.3063ZM14.2722 29.1818C14.2722 30.6648 14.4895 31.973 14.9242 33.1065C15.3588 34.2315 15.9938 35.1136 16.829 35.7528C17.6642 36.3835 18.687 36.6989 19.8972 36.6989C21.1586 36.6989 22.2111 36.3665 23.0549 35.7017C23.9071 35.0284 24.5463 34.125 24.9725 32.9915C25.4071 31.8494 25.6245 30.5795 25.6245 29.1818C25.6245 27.8011 25.4114 26.5568 24.9853 25.4489C24.5676 24.3324 23.9327 23.4503 23.0804 22.8026C22.2367 22.1463 21.1756 21.8182 19.8972 21.8182C18.6699 21.8182 17.6387 22.1293 16.8034 22.7514C15.9682 23.3651 15.3375 24.2259 14.9114 25.3338C14.4853 26.4332 14.2722 27.7159 14.2722 29.1818ZM41.9881 19.3636V21.9205H31.4029V19.3636H41.9881ZM34.5733 39V16.6534C34.5733 15.5284 34.8375 14.5909 35.3659 13.8409C35.8944 13.0909 36.5804 12.5284 37.4242 12.1534C38.2679 11.7784 39.1586 11.5909 40.0961 11.5909C40.8375 11.5909 41.4426 11.6506 41.9114 11.7699C42.3801 11.8892 42.7296 12 42.9597 12.1023L42.0904 14.7102C41.937 14.6591 41.7239 14.5952 41.4512 14.5185C41.187 14.4418 40.8375 14.4034 40.4029 14.4034C39.4057 14.4034 38.6855 14.6548 38.2424 15.1577C37.8077 15.6605 37.5904 16.3977 37.5904 17.3693V39H34.5733Z" fill="currentColor"/>
        </g>
        <defs>
          <filter id="filter0_d_2034_144" x="7.30615" y="11.5908" width="39.6533" height="42.7729" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            {/* The property names below have been changed to camelCase */}
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2034_144"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2034_144" result="shape"/>
          </filter>
        </defs>
      </svg>
      <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
        Photo Framer
      </span>
    </Link>
  );
}