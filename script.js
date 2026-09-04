document.addEventListener(
    "DOMContentLoaded",
    () => {


        // =====================================================
        // ATUALIZAR
        // =====================================================

        const refreshButton =
            document.querySelector(
                ".refresh-button"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                () => {

                    window.location.reload();

                }
            );

        }


        // =====================================================
        // SERVIDOR ATUAL
        // =====================================================

        const app =
            document.getElementById(
                "server-app"
            );


        const guildId =
            app
                ? app.dataset.guildId
                : null;


        // =====================================================
        // SALVAR ÚLTIMO SERVIDOR
        // =====================================================

        if (guildId) {

            localStorage.setItem(
                "lorfi_last_guild",
                guildId
            );

        }


        // =====================================================
        // LEMBRAR SEÇÃO
        // =====================================================

        const sectionLinks =
            document.querySelectorAll(
                ".section-link"
            );


        sectionLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        const section =
                            link.dataset.section;


                        if (!guildId || !section) {
                            return;
                        }


                        localStorage.setItem(
                            `lorfi_section_${guildId}`,
                            section
                        );

                    }
                );

            }
        );


        const lastSection =
            guildId
                ? localStorage.getItem(
                    `lorfi_section_${guildId}`
                )
                : null;


        if (
            guildId &&
            lastSection
        ) {

            const target =
                document.getElementById(
                    lastSection
                );


            if (target) {

                setTimeout(
                    () => {

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    200
                );

            }

        }


        // =====================================================
        // CORES
        // =====================================================

        const colors = [
            "primary",
            "success",
            "error",
            "warn",
            "info"
        ];


        colors.forEach(
            (name) => {

                const input =
                    document.getElementById(
                        `color-${name}`
                    );


                const label =
                    document.getElementById(
                        `color-${name}-value`
                    );


                if (!input) {
                    return;
                }


                input.addEventListener(
                    "input",
                    () => {

                        const value =
                            input.value.toUpperCase();


                        if (label) {

                            label.textContent =
                                value;

                        }

                    }
                );

            }
        );


        // =====================================================
        // AUTOMOD
        // =====================================================

        const automodToggle =
            document.getElementById(
                "automod-toggle"
            );


        if (automodToggle) {

            automodToggle.addEventListener(
                "click",
                () => {

                    const isOn =
                        automodToggle.classList.contains(
                            "is-on"
                        );


                    if (isOn) {

                        automodToggle.classList.remove(
                            "is-on"
                        );

                        automodToggle.classList.add(
                            "is-off"
                        );

                        automodToggle.textContent =
                            "Desativado";

                    } else {

                        automodToggle.classList.remove(
                            "is-off"
                        );

                        automodToggle.classList.add(
                            "is-on"
                        );

                        automodToggle.textContent =
                            "Ativado";

                    }

                }
            );

        }


        // =====================================================
        // SALVAR CONFIG
        // =====================================================

        const saveButton =
            document.getElementById(
                "save-config"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                async () => {

                    if (!guildId) {

                        alert(
                            "Servidor não identificado."
                        );

                        return;

                    }


                    const colorsData = {};


                    colors.forEach(
                        (name) => {

                            const input =
                                document.getElementById(
                                    `color-${name}`
                                );


                            if (input) {

                                colorsData[name] =
                                    input.value
                                        .toUpperCase();

                            }

                        }
                    );


                    const automodEnabled =
                        automodToggle
                            ? automodToggle.classList.contains(
                                "is-on"
                            )
                            : false;


                    saveButton.disabled =
                        true;


                    saveButton.textContent =
                        "💾 Salvando...";


                    try {

                        const response =
                            await fetch(
                                `/api/servidor/${guildId}/config`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({
                                            colors:
                                                colorsData,

                                            automod: {
                                                enabled:
                                                    automodEnabled
                                            }
                                        })
                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                "Erro ao salvar."
                            );

                        }


                        saveButton.textContent =
                            "✅ Salvo!";


                        localStorage.setItem(
                            `lorfi_colors_${guildId}`,
                            JSON.stringify(
                                colorsData
                            )
                        );


                        setTimeout(
                            () => {

                                saveButton.textContent =
                                    "💾 Salvar";

                                saveButton.disabled =
                                    false;

                            },
                            1500
                        );


                    } catch (error) {

                        console.error(
                            error
                        );


                        saveButton.textContent =
                            "❌ Erro";


                        setTimeout(
                            () => {

                                saveButton.textContent =
                                    "💾 Salvar";

                                saveButton.disabled =
                                    false;

                            },
                            1500
                        );

                    }

                }
            );

        }


        // =====================================================
        // COPIAR
        // =====================================================

        const copyButtons =
            document.querySelectorAll(
                "[data-copy]"
            );


        copyButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const text =
                            button.dataset.copy;


                        try {

                            await navigator.clipboard.writeText(
                                text
                            );


                            const original =
                                button.textContent;


                            button.textContent =
                                "✓ Copiado!";


                            setTimeout(
                                () => {

                                    button.textContent =
                                        original;

                                },
                                1500
                            );


                        } catch (error) {

                            console.error(
                                "Erro ao copiar:",
                                error
                            );

                        }

                    }
                );

            }
        );


    }
);