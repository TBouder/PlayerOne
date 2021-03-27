/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Saturday March 27th 2021
**	@Filename:				useScrollRestoration.js
******************************************************************************/

//SOURCE : https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81

import { useEffect } from 'react';

import Router from 'next/router';

function saveScrollPos(url) {
    const scrollPos = { x: window.scrollX, y: window.scrollY };
    sessionStorage.setItem(url, JSON.stringify(scrollPos));
}

function restoreScrollPos(url) {
    const scrollPos = JSON.parse(sessionStorage.getItem(url));
    if (scrollPos) {
        window.scrollTo(scrollPos.x, scrollPos.y);
    }
}

export default function useScrollRestoration(router) {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            let shouldScrollRestore = false;
            window.history.scrollRestoration = 'manual';
            restoreScrollPos(router.asPath);

            const onBeforeUnload = event => {
                saveScrollPos(router.asPath);
                delete event['returnValue'];
            };

            const onRouteChangeStart = () => {
                saveScrollPos(router.asPath);
            };

            const onRouteChangeComplete = url => {
                if (shouldScrollRestore) {
                    shouldScrollRestore = false;
                    restoreScrollPos(url);
                }
            };

            window.addEventListener('beforeunload', onBeforeUnload);
            Router.events.on('routeChangeStart', onRouteChangeStart);
            Router.events.on('routeChangeComplete', onRouteChangeComplete);
            Router.beforePopState(() => {
                shouldScrollRestore = true;
                return true;
            });

            return () => {
                window.removeEventListener('beforeunload', onBeforeUnload);
                Router.events.off('routeChangeStart', onRouteChangeStart);
                Router.events.off('routeChangeComplete', onRouteChangeComplete);
                Router.beforePopState(() => true);
            };
        }
    }, [router]);
}