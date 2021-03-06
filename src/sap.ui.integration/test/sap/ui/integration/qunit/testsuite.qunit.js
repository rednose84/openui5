sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit TestSuite for sap.ui.integration",
		defaults: {
			qunit: {
				version: "edge"
			},
			sinon: {
				version: "edge"
			},
			ui5: {
				libs: ["sap.f", "sap.m"], // Libraries to load upfront in addition to the library which is tested, if null no libs are loaded
				noConflict: true,
				preload: "auto"
			},
			coverage: {
				only: ["sap/ui/integration"]
			},
			autostart: true
		},
		tests: {
			"Card": {
				coverage: {
					only: [
						"sap/ui/integration/widgets/Card"
					]
				},
				module: [
					'./Card.qunit',
					'./CardDataHandling.qunit',
					'./CardDesigntime.qunit'
				]
			},
			"cardbundle/CardStaticResources": {},
			"util/CardManifest": {
				coverage: {
					only: [
						"sap/ui/integration/util/CardManifest"
					]
				}
			},
			"util/ServiceManager": {
				coverage: {
					only: [
						"sap/ui/integration/util/ServiceManager"
					]
				}
			},
			"customElements/CustomElements": {
				ui5: {
					libs: ["sap.ui.integration"]
				},
				coverage: {
					only: [
						"sap/ui/integration/customElements/"
					]
				}
			},
			"designtime": {
				coverage: {
					only: [
						"sap/ui/integration/designtime/baseEditor/BaseEditor",
						"sap/ui/integration/designtime/baseEditor/ObjectBinding"
					]
				},
				module: [
					'./designtime/baseEditor/BaseEditor.qunit',
					'./designtime/baseEditor/ObjectBinding.qunit'
				]
			},
			"AllCards": {
				ui5: {
					libs: ["sap.ui.integration"]
				},
				coverage: {
					only: [
						"sap/ui/integration/widgets/Card",
						"sap/ui/integration/util/CardManifest",
						"sap/ui/integration/util/ServiceManager",
						"sap/ui/integration/customElements/",
						"sap/f/cards/CardActions",
						"sap/f/cards/AnalyticalContent",
						"sap/f/cards/BindingResolver",
						"sap/f/cards/ComponentContent",
						"sap/f/cards/DataProvider",
						"sap/f/cards/DataProviderFactory",
						"sap/f/cards/Header",
						"sap/f/cards/HeaderRenderer",
						"sap/f/cards/ListContent",
						"sap/f/cards/NumericHeader",
						"sap/f/cards/NumericHeaderRenderer",
						"sap/f/cards/NumericSideIndicator",
						"sap/f/cards/NumericSideIndicatorRenderer",
						"sap/f/cards/ObjectContent",
						"sap/f/cards/RequestDataProvider",
						"sap/f/cards/ServiceDataProvider",
						"sap/f/cards/TableContent",
						"sap/f/cards/IconFormatter"
					]
				},
				module: [
					'./Card.qunit',
					'./CardDataHandling.qunit',
					'./util/CardManifest.qunit',
					'./util/ServiceManager.qunit',
					'./customElements/CustomElements.qunit',
					'test-resources/sap/f/qunit/BindingResolver.qunit',
					'test-resources/sap/f/qunit/DataProvider.qunit',
					'./CardActions.qunit',
					'./cardbundle/CardStaticResources.qunit'
				]
			}
		}
	};
});