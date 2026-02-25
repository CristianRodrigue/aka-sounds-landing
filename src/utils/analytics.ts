declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fbq: any;
        _fbq: any;
    }
}

let analyticsInitialized = false;

export const initializeAnalytics = () => {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    // Utilize requestIdleCallback for non-blocking script injection
    const injectScripts = () => {
        // --- Google Analytics ---
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-LV0HHXVPZT';
        document.head.appendChild(gaScript);

        const gaInitScript = document.createElement('script');
        gaInitScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-LV0HHXVPZT');
    `;
        document.head.appendChild(gaInitScript);

        // --- Meta Pixel ---
        const fbScript = document.createElement('script');
        fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '868470356186101');
      fbq('track', 'PageView');
    `;
        document.head.appendChild(fbScript);
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(injectScripts);
    } else {
        setTimeout(injectScripts, 1);
    }
};
