import { css, html, LitElement } from 'https://esm.sh/lit';

export class SupabaseForm extends LitElement {

    async = false;
    action = '/wp-admin/admin-post.php';
    withStyles = false;
    injectStyle = '';

    static properties = {
        async: { attribute: 'async', type: Boolean },
        action: { attribute: 'action', type: String },
        withStyles: { attribute: 'with-styles', type: Boolean },
        injectStyle: { attribute: 'inject-style', type: String }
    };

    static styles = css`
        :host([with-styles]) {
            --supabase-color-brand: rgb(0 98 57 / 100%);
            --supabase-color-background: rgb(23 23 23 / 90%);
            --supabase-color-foreground: rgb(255 255 255 / 66%);
            --supabase-color-border: rgb(255 255 255 / 18%);
            --supabase-color-highlight: rgb(255 255 255 / 10%);
            --supabase-color-input: rgb(255 255 255 / 3.33%);
            
            --button-color: attr(button-color type(<color>), var(--supabase-color-brand));
            --button-text-color: attr(button-text-color type(<color>), white);
            
            --width: attr(width px, auto);
            --padding: attr(padding px, 32px);
            --provider-columns: attr(provider-columns type(<number>), 1);

            display: flex;
            width: var(--width);
            min-width: 320px;
            padding: var(--padding);
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: white;
            background: var(--supabase-color-background);
            border: 1px solid var(--supabase-color-border);
            border-radius: 0.375rem;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(16px);

            form {
                display: flex;
                flex-direction: column;
                width: 100%;
                gap: 32px;

                header {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    gap: 32px;

                    svg {
                        height: 24px;
                    }

                    div {
                        display: flex;
                        flex-direction: column;
                        gap: 0.33rem;

                        h1 {
                            margin: 0;
                            color: white;
                            font-size: 2.33rem;
                            font-weight: lighter;
                        }

                        p {
                            margin: 0;
                            color: var(--supabase-color-foreground);
                            font-size: 0.75rem;
                        }
                    }
                }
                
                section.providers {
                    
                    section.provider-buttons {
                        display: grid;
                        grid-template-columns: repeat(var(--provider-columns), 1fr);
                        flex-direction: column;
                        gap: 16px;

                        button {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            height: 38px;
                            padding: 0;
                            background: var(--supabase-color-highlight);
                            border: 1px solid var(--supabase-color-border);
                            border-radius: 0.375rem;
                            font-size: 0.9rem;
                            font-family: inherit;
                            color: var(--supabase-color-foreground);
                            
                            svg {
                                opacity: 0.66;
                            }
                            
                            span {
                                color: white;
                            }
                        }
                    }
                    
                    div.provider-divider {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--supabase-color-foreground);
                        font-size: 0.75rem;
                        position: relative;
                        margin-top: 32px;
                        text-transform: lowercase;

                        &::before, &::after {
                            content: '';
                            flex-grow: 1;
                            height: 1px;
                            background-color: var(--supabase-color-border);
                        }

                        &::before {
                            margin-right: 8px;
                        }

                        &::after {
                            margin-left: 8px;
                        }
                    }
                }

                section.fields {
                    display: flex;
                    width: 100%;
                    flex-direction: column;
                    gap: 16px;

                    section.field {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;

                        label {
                            color: var(--supabase-color-foreground);
                            font-size: 0.75rem;
                        }

                        input {
                            height: 36px;
                            padding: 0;
                            background: var(--supabase-color-input);
                            border: 1px solid var(--supabase-color-border);
                            border-radius: 0.375rem;
                        }
                    }
                }

                section.actions {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    button[type="submit"] {
                        height: 38px;
                        padding: 0;
                        background: var(--button-color);
                        border: 1px solid var(--supabase-color-border);
                        border-radius: 0.375rem;
                        font-size: 0.9rem;
                        font-family: inherit;
                        color: var(--button-text-color);
                    }

                    p {
                        color: var(--supabase-color-foreground);
                        font-size: 0.75rem;
                        text-align: center;

                        a {
                            color: white;
                        }
                    }
                }
            }
        }
    `;

    render() {
        return html`
            <style>${this.injectStyle}</style>
            <form method="post" action="${this.action}" @submit="${this.handleSubmit}">
                <input type="hidden" name="action" value="supabase_form_submit">
                <header>
                    <slot name="logo">
                        ${this.withStyles ? html`
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 581 113" fill="none">
                                <path d="M151.397 66.761C151.996 72.3623 157.091 81.9644 171.877 81.9644C184.764 81.9644 190.959 73.7627 190.959 65.7609C190.959 58.5592 186.063 52.658 176.373 50.6574L169.379 49.1571C166.682 48.657 164.884 47.1568 164.884 44.7561C164.884 41.9555 167.681 39.8552 171.178 39.8552C176.772 39.8552 178.87 43.5558 179.27 46.4566L190.359 43.9561C189.76 38.6549 185.064 29.7529 171.078 29.7529C160.488 29.7529 152.696 37.0545 152.696 45.8563C152.696 52.7579 156.991 58.4593 166.482 60.5596L172.976 62.0601C176.772 62.8601 178.271 64.6607 178.271 66.8611C178.271 69.4618 176.173 71.7623 171.777 71.7623C165.983 71.7623 163.085 68.1613 162.786 64.2605L151.397 66.761Z" fill="white"/>
                                <path d="M233.421 80.4639H246.109C245.909 78.7635 245.609 75.3628 245.609 71.5618V31.2529H232.321V59.8592C232.321 65.5606 228.925 69.5614 223.031 69.5614C216.837 69.5614 214.039 65.1604 214.039 59.6592V31.2529H200.752V62.3599C200.752 73.0622 207.545 81.7642 219.434 81.7642C224.628 81.7642 230.325 79.7638 233.022 75.1627C233.022 77.1631 233.221 79.4636 233.421 80.4639Z" fill="white"/>
                                <path d="M273.076 99.4682V75.663C275.473 78.9636 280.469 81.6644 287.263 81.6644C301.149 81.6644 310.439 70.6617 310.439 55.7584C310.439 41.1553 302.148 30.1528 287.762 30.1528C280.37 30.1528 274.875 33.4534 272.677 37.2544V31.253H259.79V99.4682H273.076ZM297.352 55.8585C297.352 64.6606 291.958 69.7616 285.164 69.7616C278.372 69.7616 272.877 64.5605 272.877 55.8585C272.877 47.1566 278.372 42.0554 285.164 42.0554C291.958 42.0554 297.352 47.1566 297.352 55.8585Z" fill="white"/>
                                <path d="M317.964 67.0611C317.964 74.763 324.357 81.8645 334.848 81.8645C342.139 81.8645 346.835 78.4636 349.332 74.5627C349.332 76.4632 349.532 79.1638 349.832 80.4642H362.02C361.72 78.7637 361.422 75.2629 361.422 72.6625V48.457C361.422 38.5548 355.627 29.7529 340.043 29.7529C326.855 29.7529 319.761 38.2546 318.963 45.9565L330.751 48.457C331.151 44.1561 334.348 40.4552 340.141 40.4552C345.737 40.4552 348.434 43.3558 348.434 46.8566C348.434 48.5571 347.536 49.9574 344.738 50.3575L332.65 52.1578C324.458 53.3581 317.964 58.2591 317.964 67.0611ZM337.644 71.9623C333.349 71.9623 331.25 69.1616 331.25 66.2611C331.25 62.4601 333.947 60.5596 337.345 60.0597L348.434 58.3592V60.5596C348.434 69.2617 343.239 71.9623 337.644 71.9623Z" fill="white"/>
                                <path d="M387.703 80.4641V74.4627C390.299 78.6637 395.494 81.6644 402.288 81.6644C416.276 81.6644 425.467 70.5618 425.467 55.6585C425.467 41.0552 417.174 29.9528 402.788 29.9528C395.494 29.9528 390.1 33.1535 387.902 36.6541V8.04785H374.815V80.4641H387.703ZM412.178 55.7584C412.178 64.7605 406.784 69.7616 399.99 69.7616C393.297 69.7616 387.703 64.6606 387.703 55.7584C387.703 46.7564 393.297 41.8554 399.99 41.8554C406.784 41.8554 412.178 46.7564 412.178 55.7584Z" fill="white"/>
                                <path d="M432.99 67.0611C432.99 74.763 439.383 81.8645 449.873 81.8645C457.165 81.8645 461.862 78.4636 464.358 74.5627C464.358 76.4632 464.559 79.1638 464.858 80.4642H477.046C476.748 78.7637 476.448 75.2629 476.448 72.6625V48.457C476.448 38.5548 470.653 29.7529 455.068 29.7529C441.881 29.7529 434.788 38.2546 433.989 45.9565L445.776 48.457C446.177 44.1561 449.374 40.4552 455.167 40.4552C460.763 40.4552 463.46 43.3558 463.46 46.8566C463.46 48.5571 462.561 49.9574 459.763 50.3575L447.676 52.1578C439.484 53.3581 432.99 58.2591 432.99 67.0611ZM452.671 71.9623C448.375 71.9623 446.276 69.1616 446.276 66.2611C446.276 62.4601 448.973 60.5596 452.371 60.0597L463.46 58.3592V60.5596C463.46 69.2617 458.265 71.9623 452.671 71.9623Z" fill="white"/>
                                <path d="M485.645 66.761C486.243 72.3623 491.339 81.9644 506.124 81.9644C519.012 81.9644 525.205 73.7627 525.205 65.7609C525.205 58.5592 520.311 52.658 510.62 50.6574L503.626 49.1571C500.929 48.657 499.132 47.1568 499.132 44.7561C499.132 41.9555 501.928 39.8552 505.425 39.8552C511.021 39.8552 513.118 43.5558 513.519 46.4566L524.607 43.9561C524.007 38.6549 519.312 29.7529 505.326 29.7529C494.735 29.7529 486.944 37.0545 486.944 45.8563C486.944 52.7579 491.238 58.4593 500.73 60.5596L507.224 62.0601C511.021 62.8601 512.519 64.6607 512.519 66.8611C512.519 69.4618 510.421 71.7623 506.025 71.7623C500.23 71.7623 497.334 68.1613 497.034 64.2605L485.645 66.761Z" fill="white"/>
                                <path d="M545.385 50.2574C545.685 45.7564 549.482 40.5551 556.375 40.5551C563.967 40.5551 567.165 45.3564 567.365 50.2574H545.385ZM568.664 63.0603C567.065 67.4612 563.668 70.562 557.474 70.562C550.88 70.562 545.385 65.8608 545.087 59.3595H580.252C580.252 59.1593 580.451 57.1589 580.451 55.2584C580.451 39.4549 571.361 29.7529 556.175 29.7529C543.588 29.7529 531.998 39.9551 531.998 55.6587C531.998 72.2622 543.886 81.9644 557.374 81.9644C569.462 81.9644 577.255 74.8629 579.753 66.361L568.664 63.0603Z" fill="white"/>
                                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0625L99.1935 40.0625C107.384 40.0625 111.952 49.5226 106.859 55.9372L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0625L99.1935 40.0625C107.384 40.0625 111.952 49.5226 106.859 55.9372L63.7076 110.284Z" fill="url(#paint1_linear)" fill-opacity="0.2"/>
                                <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                                <defs>
                                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.9738" x2="94.1635" y2="71.8293" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#249361"/>
                                        <stop offset="1" stop-color="#3ECF8E"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear" x1="36.1558" y1="30.5779" x2="54.4844" y2="65.0804" gradientUnits="userSpaceOnUse">
                                        <stop/>
                                        <stop offset="1" stop-opacity="0"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        ` : ''}
                    </slot>
                    <slot name="header">
                        <div>
                            <h1>Welcome back</h1>
                            <p>Sign in to your account</p>
                        </div>
                    </slot>
                </header>
                <section class="providers">
                    <section class="provider-buttons">
                        <button type="button" name="facebook" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1.5 0 20 20" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g transform="translate(-102.000000, -7439.000000)" fill="currentColor">
                                        <g transform="translate(56.000000, 160.000000)">
                                            <path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485" id="apple-[#173]"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <span>
                                Apple
                            </span>
                        </button>
                        <button type="button" name="facebook" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24" role="img">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>
                                Facebook
                            </span>
                        </button>
                        <button type="button" name="google" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="-3 0 262 262" version="1.1" preserveAspectRatio="xMidYMid">
                                <g>
                                    <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451"></path>
                                    <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1"></path>
                                    <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37"></path>
                                    <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479"></path>
                                </g>
                            </svg>
                            <span>
                                Google
                            </span>
                        </button>
                        <button type="button" name="azure" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20" version="1.1">
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -7519.000000)" fill="currentColor">
                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                            <path d="M174,7379 L184,7379 L184,7370 L174,7370 L174,7379 Z M164,7379 L173,7379 L173,7370 L164,7370 L164,7379 Z M174,7369 L184,7369 L184,7359 L174,7359 L174,7369 Z M164,7369 L173,7369 L173,7359 L164,7359 L164,7369 Z" id="microsoft-[#150]"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <span>
                                Microsoft
                            </span>
                        </button>
                        <button type="button" name="linkedin" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="1.1" width="20" height="20" viewBox="0 0 512 512" xml:space="preserve">
                                <path style="display: inline; fill-rule: evenodd; clip-rule: evenodd;" d="M116.504,500.219V170.654H6.975v329.564H116.504   L116.504,500.219z M61.751,125.674c38.183,0,61.968-25.328,61.968-56.953c-0.722-32.328-23.785-56.941-61.252-56.941   C24.994,11.781,0.5,36.394,0.5,68.722c0,31.625,23.772,56.953,60.53,56.953H61.751L61.751,125.674z M177.124,500.219   c0,0,1.437-298.643,0-329.564H286.67v47.794h-0.727c14.404-22.49,40.354-55.533,99.44-55.533   c72.085,0,126.116,47.103,126.116,148.333v188.971H401.971V323.912c0-44.301-15.848-74.531-55.497-74.531   c-30.254,0-48.284,20.38-56.202,40.08c-2.897,7.012-3.602,16.861-3.602,26.711v184.047H177.124L177.124,500.219z"></path>
                            </svg>
                            <span>
                                LinkedIn
                            </span>
                        </button>
                        <button type="button" name="linkedin" @click="${this.handleProviderClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" fill="currentColor">
                                <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
                            </svg>
                            <span>
                                Twitter
                            </span>
                        </button>
                    </section>
                    <div class="provider-divider">Or</div>
                </section>
                <section class="fields">
                    <section class="email-field field">
                        <slot name="email-field">
                            <label for="email-field">Email</label>
                            <input id="email-field" name="email" type="email" required>
                        </slot>
                    </section>
                    <section class="password-field field">
                        <slot name="password-field">
                            <label for="password-field">Password</label>
                            <input id="password-field" name="password" type="password" required>
                        </slot>
                    </section>
                </section>
                <section class="actions">
                    <slot name="actions">
                        <button class="submit-button" type="submit">Sign In</button>
                        <p>
                            Don't have an account? <a href="/">Sign Up Now</a>
                        </p>
                    </slot>
                </section>
            </form>
        `;
    }

    handleSubmit(event) {
        if (this.async) {
            event.preventDefault();
            this.#submitAsync('password');
        }
    }

    handleProviderClick(event) {
        this.#submitAsync(event.currentTarget.name);
    }

    async #submitAsync(provider) {
        const form = this.shadowRoot.querySelector('form');
        const email = form.email.value;
        const password = form.password.value;

        if (provider === 'email') try {
            const signInResponse = await supabase.auth.signInWithPassword({ email, password })

            if (signInResponse.error) {
                // TODO message error to user
            } else if (signInResponse.data.user) {
                const user = signInResponse.data.user;
                const providers = user.identities.map(identity => identity.provider);
                const metadata = {
                    first_name: user.user_metadata.first_name,
                    last_name: user.user_metadata.last_name,
                    name: user.user_metadata.name,
                    phone: user.user_metadata.phone ?? user.phone
                };

                const linkUserResponse = await supabase.wordpress.syncUser(user.email, user.id, providers, metadata);

                if (linkUserResponse.error) {
                    // TODO what should we do if the user is not linked?
                } else if (linkUserResponse.data) {
                    this.dispatchEvent(new CustomEvent('link-user', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            reference: linkUserResponse.data
                        }
                    }));
                }

                this.dispatchEvent(new CustomEvent('authenticate', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        user: signInResponse.data.user,
                        session: signInResponse.data.session,
                        reference: linkUserResponse.data
                    }
                }));
            }
        } catch (error) {
            console.error(error);
        } else {
            void supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.href}?login=pending`
                }
            });
        }
    }
}