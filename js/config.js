/* Site configuration. One line per value; nothing else needs editing to switch a service on.
   While a value is null the matching service stays off.

   tallyFormId        null in the working preview: the offline stand-in form (stores and sends nothing).
   releaseTallyFormId the live Tally form id (the …/r/<id> part). tools/prepare-release.js writes it into
                      tallyFormId in the release copy, where the embed loads only when a visitor opens the waitlist.
   goatcounterCode  GoatCounter site code (the dashboard subdomain). Used by tools/prepare-release.js to add
                    GoatCounter's script tag to the RELEASE copy only; the local preview never loads it.
                    null = no analytics in the release either.
   siteUrl          public URL; set by tools/prepare-release.js in the release copy only.
   contactEmail     address for "delete my data" requests (also shown in the privacy note). */
window.M2P_CONFIG = {
  tallyFormId: 'vXPAZX',
  releaseTallyFormId: 'vXPAZX',    // live Tally form, injected into the RELEASE copy only by tools/prepare-release.js
  goatcounterCode: 'mtplaybook',
  siteUrl: 'https://mariorodro.github.io/masterclass-to-playbook/',
  contactEmail: 'kevingrokbot@agentmail.to',
  priceUsd: 49,             // planned one-time price shown on the site; keep in sync with [data-price]
  updatesMonths: 12         // months of updates included with the one-time price
};
