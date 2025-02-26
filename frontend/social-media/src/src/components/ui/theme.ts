import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        breakpoints: {
            base: '320px',
            sm: '375px',
            md: '414px',
            lg: '768px',
            tablet: '992px',
            desktop: '1200px',
            wide: '1392px',
            wideDesktop: '1680px'
        }
    }
})

export default createSystem(defaultConfig, config)