/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/layout/DynamicSideContent",
	"sap/m/Button",
	"sap/ui/Device"
], function(DynamicSideContent, Button, Device) {
	"use strict";

	(function ($) {

		var	S = "S",
			M = "M",
			L = "L",
			XL = "XL",
			SPAN_SIZE_3 = 3,
			SPAN_SIZE_4 = 4,
			SPAN_SIZE_6 = 6,
			SPAN_SIZE_8 = 8,
			SPAN_SIZE_9 = 9,
			SPAN_SIZE_12 = 12,
			MC_FIXED_CLASS = "sapUiDSCMCFixed",
			SC_FIXED_CLASS = "sapUiDSCSCFixed",
			INVALID_BREAKPOINT_ERROR_MSG = "Invalid Breakpoint. Expected: S, M, L or XL",
			SIDE_CONTENT_LABEL = "SIDE_CONTENT_LABEL";

		QUnit.module("Public API", {
			beforeEach : function () {
				// Replacing jQuery width method to report stable browser screen resolution for the test
				var that = this;
				this._ojQueryWidthMethod = jQuery.fn.width;
				jQuery.fn.width = function (sWidth) {
					if (!sWidth && this[0] === window) {
						return 1440;
					}
					return that._ojQueryWidthMethod.apply(this, arguments);
				};

				this._oDSC = new DynamicSideContent();
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC.destroy();
				this._oDSC = null;

				// Restoring jQuery width method to the original one
				jQuery.fn.width = this._ojQueryWidthMethod;
			}
		});

		QUnit.test("Default values",function(assert) {
			assert.strictEqual(this._oDSC.isSideContentVisible(), true, "'showSideContent' property default value should be 'true'");
			assert.strictEqual(this._oDSC.isMainContentVisible(), true, "'showMainContent' property default value should be 'true'");
			assert.strictEqual(this._oDSC.getSideContentVisibility(), sap.ui.layout.SideContentVisibility.ShowAboveS, "'showMainContent' property default value should be 'ShowAboveS'");
			assert.strictEqual(this._oDSC.getSideContentFallDown(), sap.ui.layout.SideContentFallDown.OnMinimumWidth, "'showMainContent' property default value should be 'onMinimumWidth'");
			assert.strictEqual(this._oDSC.getEqualSplit(), false, "'equalSplit' property default value should be false");
			assert.strictEqual(this._oDSC.getContainerQuery(), false, "'containerQuery' property default value should be false");
			assert.strictEqual(this._oDSC.getSideContentPosition(), sap.ui.layout.SideContentPosition.End, "'sideContentPosition' property default value should be 'false'");
		});

		QUnit.test("'sideContentPosition' property set to End by default",function(assert) {
			var oSideContent = this._oDSC.$("SCGridCell"),
				oMainContent = this._oDSC.$("MCGridCell");

			assert.ok(oSideContent.position().left > oMainContent.position().left, "Main content is before the side content by default");
		});

		QUnit.test("'sideContentPosition' property set to Begin",function(assert) {

			this._oDSC.setSideContentPosition(sap.ui.layout.SideContentPosition.Begin);
			sap.ui.getCore().applyChanges();

			var oSideContent = this._oDSC.$("SCGridCell"),
			oMainContent = this._oDSC.$("MCGridCell");

			assert.ok(oSideContent.position().left < oMainContent.position().left, "Side content is before the main content");
		});

		QUnit.test("'ShowSideContent' property is set correctly",function(assert) {
			var bSuppressVisualUpdate = false;
			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setShowSideContent(false, bSuppressVisualUpdate);
			assert.strictEqual(this._oDSC.isSideContentVisible(), false, "'showSideContent' property is set to false");
			assert.ok(this._oDSC._changeGridState.calledOnce, "_changeGridState is called when side content is not visible");

			this._oDSC._changeGridState.restore();

			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setShowSideContent(true, bSuppressVisualUpdate);
			assert.strictEqual(this._oDSC.isSideContentVisible(), true, "'showSideContent' property is set to true");
			assert.ok(this._oDSC._changeGridState.calledOnce, "_changeGridState is called when side content is visible and suppressVisualUpdate is false");

			this._oDSC._changeGridState.restore();

			sinon.spy(this._oDSC, "_changeGridState");
			bSuppressVisualUpdate = true;
			this._oDSC.setShowSideContent(false, bSuppressVisualUpdate);
			assert.ok(!this._oDSC._changeGridState.calledOnce, "_changeGridState is not called when suppressVisualUpdate is true");
			this._oDSC._changeGridState.restore();
		});

		QUnit.test("'ShowMainContent' property is set correctly",function(assert) {
			var bSuppressInvalidate = false;

			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setShowMainContent(false, bSuppressInvalidate);
			assert.strictEqual(this._oDSC.isMainContentVisible(), false, "'showMainContent' property is set to false");
			assert.ok(this._oDSC._changeGridState.calledOnce, "_changeGridState is called when main content is not visible");

			this._oDSC._changeGridState.restore();

			sinon.spy(this._oDSC, "_changeGridState");

			bSuppressInvalidate = true;
			this._oDSC._MCVisible = true;
			assert.ok(!this._oDSC._changeGridState.calledOnce, "_changeGridState is not called when suppressVisualUpdate is true");

			this._oDSC._changeGridState.restore();

			sinon.spy(this._oDSC, "_changeGridState");

			bSuppressInvalidate = false;
			this._oDSC.setShowMainContent(true, bSuppressInvalidate);
			assert.strictEqual(this._oDSC.isMainContentVisible(), true, "'showMainContent' property is set to true");
			assert.ok(this._oDSC._changeGridState.calledOnce, "_changeGridState is called when main content is visible and suppressVisualUpdate is false");

			this._oDSC._changeGridState.restore();
		});

		QUnit.test("'EqualSplit' property is set correctly",function(assert) {
			sinon.spy(this._oDSC, "_setResizeData");
			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setEqualSplit(true);
			assert.strictEqual(this._oDSC.getEqualSplit(), true, "'equalSplit' property is set to true");
			assert.strictEqual(this._oDSC.isSideContentVisible(), true, "Side content should be visible");
			assert.strictEqual(this._oDSC.isMainContentVisible(), true, "Main content should be visible");

			this._oDSC._currentBreakpoint = XL;
			assert.ok(this._oDSC._setResizeData.calledOnce, "_setResizeData is called");
			assert.ok(this._oDSC._changeGridState.calledOnce, "_changeGridState is called");

			this._oDSC._setResizeData.restore();
			this._oDSC._changeGridState.restore();

			sinon.spy(this._oDSC, "_setResizeData");
			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC._currentBreakpoint = null;
			this._oDSC.setEqualSplit(false);
			assert.ok(!this._oDSC._setResizeData.calledOnce, "_setResizeData is not called when no breakpoint is set");
			assert.ok(!this._oDSC._changeGridState.calledOnce, "_changeGridState is not called when no breakpoint is set");

			this._oDSC._setResizeData.restore();
			this._oDSC._changeGridState.restore();
		});

		QUnit.test("'SideContent' aggregation is set correctly",function(assert) {
			var oButton = new Button("button1");

			sinon.spy(this._oDSC, "_rerenderControl");

			this._oDSC.addSideContent(oButton);
			assert.strictEqual(this._oDSC.getSideContent()[0], oButton, "'SideContent' aggregation is set with button1");
			assert.ok(this._oDSC._rerenderControl.calledOnce, "_rerenderControl is called");

			this._oDSC._rerenderControl.restore();
			oButton.destroy();
			oButton = null;
		});

		QUnit.test("'MainContent' aggregation is set correctly",function(assert) {
			var oButton = new Button("button1");

			sinon.spy(this._oDSC, "_rerenderControl");

			this._oDSC.addMainContent(oButton);
			assert.strictEqual(this._oDSC.getMainContent()[0], oButton, "'MainContent' aggregation is set with button1");
			assert.ok(this._oDSC._rerenderControl.calledOnce, "_rerenderControl is called");

			this._oDSC._rerenderControl.restore();
			oButton.destroy();
			oButton = null;
		});

		QUnit.test("'Toggle' button functionality",function(assert) {
			// 1
			sinon.spy(this._oDSC, "_changeGridState");
			this._oDSC.setEqualSplit(true);
			this._oDSC._currentBreakpoint = S;
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = false;

			this._oDSC.toggle();

			assert.ok(
				this._oDSC._changeGridState.called,
				"_changeGridState is called only when EqualSplit mode is true and current breakpoint is 'S'"
			);

			assert.strictEqual(this._oDSC._MCVisible, false, "'showMainContent' property is 'false'");
			assert.strictEqual(this._oDSC._SCVisible, true, "'showSideContent' property is 'true'");

			this._oDSC._MCVisible = false;
			this._oDSC._SCVisible = true;

			this._oDSC.toggle();

			assert.strictEqual(this._oDSC._MCVisible, true, "'showMainContent' property is 'true'");
			assert.strictEqual(this._oDSC._SCVisible, false, "'showSideContent' property is 'false'");

			this._oDSC._changeGridState.restore();

			// 2
			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setEqualSplit(false);
			this._oDSC._currentBreakpoint = M;

			assert.ok(!this._oDSC._rerenderControl.calledOnce, "_changeGridState is not called when EqualSplit mode is false");

			this._oDSC._changeGridState.restore();

			// 3
			sinon.spy(this._oDSC, "_changeGridState");

			this._oDSC.setEqualSplit(true);
			this._oDSC._currentBreakpoint = M;

			assert.ok(!this._oDSC._rerenderControl.calledOnce, "_changeGridState is not called when current breakpoint is different than 'S'");

			this._oDSC._changeGridState.restore();

			// 4
			this._oDSC.setEqualSplit(false);
			this._oDSC.setShowSideContent(false);
			this._oDSC._currentBreakpoint = S;
			this._oDSC.toggle();
			assert.ok(this._oDSC.isSideContentVisible(), "Side content should be visible when toggled");
			assert.ok(this._oDSC._SCVisible, "Side content internal visible property should be true");
			assert.ok(!this._oDSC.isMainContentVisible(), "Main content should not be visible when toggled");
			assert.ok(!this._oDSC._MCVisible, "Main content internal visible property should be false");

		});

		QUnit.test("setSideContentVisibility functionality",function(assert) {
			this._oDSC._currentBreakpoint = L;

			// assert if both "contents" are visible on L size
			assert.strictEqual(this._oDSC._MCVisible, true, "'showMainContent' property is 'true'");
			assert.strictEqual(this._oDSC._SCVisible, true, "'showSideContent' property is 'true'");

			// set property sideContetnVisibility to "neverShow"
			this._oDSC.setSideContentVisibility("NeverShow");

			// assert that only the main content is visible on L size
			assert.strictEqual(this._oDSC._MCVisible, true, "'showMainContent' property is 'true'");
			assert.strictEqual(this._oDSC._SCVisible, false, "'showSideContent' property is 'false'");

		});

		QUnit.module("Helper functionality", {
			beforeEach : function () {
				// Replacing jQuery width method to report stable browser screen resolution for the test
				var that = this;
				this._ojQueryWidthMethod = jQuery.fn.width;
				jQuery.fn.width = function (sWidth) {
					if (!sWidth && this[0] === window) {
						return 500;
					}
					return that._ojQueryWidthMethod.apply(this, arguments);
				};

				this._oDSC = new DynamicSideContent();
				this._oDSC.placeAt("qunit-fixture");

				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC.destroy();
				this._oDSC = null;

				// Restoring jQuery width method to the original one
				jQuery.fn.width = this._ojQueryWidthMethod;
			},
			assertOnSideContentVisibility : function(sBreakpoint, sideContentVisibility, bExpectedResult, bIsInComparisonMode, assert) {
				this._oDSC.setSideContentVisibility(sideContentVisibility);
				this._oDSC._setResizeData(sBreakpoint, bIsInComparisonMode);

				assert.strictEqual(
						this._oDSC._SCVisible,
						bExpectedResult,
						"Side content is hidden on " + "'" + sBreakpoint + "'" + " breakpoint when 'SideContentVisibility' property it set to " + sideContentVisibility
				);
			},
			assertOnMainContentVisibility : function(sBreakpoint, bExpectedResult, bIsInComparisonMode, assert) {
				this._oDSC._setResizeData(sBreakpoint, bIsInComparisonMode);

				assert.strictEqual(
						this._oDSC._MCVisible,
						bExpectedResult,
						"Main content is hidden on " + "'" + sBreakpoint + "'"
				);
			},
			assertOnContentSpanSize : function(sContentName, sSpanPropertyName, sBreakpoint, sideContentFallDown, bExpectedResult, bIsInComparisonMode, assert) {
				this._oDSC.setSideContentFallDown(sideContentFallDown);
				this._oDSC._setResizeData(sBreakpoint, bIsInComparisonMode);

				assert.strictEqual(
						this._oDSC[sSpanPropertyName],
						bExpectedResult,
						sContentName + " content span size is set to " + bExpectedResult + " when breakpoint is " + "'" + sBreakpoint + "'" + " and 'SideContentFallDown' property is set to " + sideContentFallDown
				);
			}
		});

		QUnit.test("Control should work with 0px width", function (assert) {
			var sBreakpoint;

			// _getBreakPointFromWidth
			sBreakpoint = this._oDSC._getBreakPointFromWidth(0);
			assert.strictEqual(sBreakpoint, S, "If parent container's width is 0px, the breakpoint should default to 'S'");

			// _setBreakpointFromWidth
			this._oDSC._setBreakpointFromWidth(0);
			assert.strictEqual(this._oDSC.getCurrentBreakpoint(), S, "If setting the breakpoint from width 0px, the breakpoint should default to 'S'");
		});

		QUnit.test("Calculate breakpoint from width",function(assert) {
			var sBreakpoint;

			// test S breakpoint
			sBreakpoint = this._oDSC._getBreakPointFromWidth(200);
			assert.strictEqual(sBreakpoint, S, "If parent container's width is under 720px, the breakpoint should be 'S'");

			sBreakpoint = this._oDSC._getBreakPointFromWidth(720);
			assert.strictEqual(sBreakpoint, S, "If parent container's width is equal to 720px, the breakpoint should be 'S'");

			// test M breakpoint
			sBreakpoint = this._oDSC._getBreakPointFromWidth(800);
			assert.strictEqual(sBreakpoint, M, "If parent container's width is in the range 720px-1024px includingly, the breakpoint should be 'M'");

			sBreakpoint = this._oDSC._getBreakPointFromWidth(1024);
			assert.strictEqual(sBreakpoint, M, "If parent container's width is in the range 720px-1024px includingly, the breakpoint should be 'M'");

			// test L breakpoint
			sBreakpoint = this._oDSC._getBreakPointFromWidth(1060);
			assert.strictEqual(sBreakpoint, L, "If parent container's width is in the range 1024px-1440px includingly, the breakpoint should be 'L'");

			sBreakpoint = this._oDSC._getBreakPointFromWidth(1440);
			assert.strictEqual(sBreakpoint, L, "If parent container's width is in the range 1024px-1440px includingly, the breakpoint should be 'L'");

			// test XL breakpoint
			sBreakpoint = this._oDSC._getBreakPointFromWidth(1500);
			assert.strictEqual(sBreakpoint, XL, "If parent container's width is above 1440px, the breakpoint should be 'XL'");

		});

		QUnit.test("The size of the main and side content is calculated correctly, according to the current breakpoint",function(assert) {
			var bIsInComparisonMode = false;

			// S breakpoint
			this._oDSC._setResizeData(S, bIsInComparisonMode);

			assert.strictEqual(this._oDSC._iMcSpan, SPAN_SIZE_12, "Main content span size is set to 12 when breakpoint is 'S'");
			assert.strictEqual(this._oDSC._iScSpan, SPAN_SIZE_12, "Side content span size is set to 12 when breakpoint is 'S'.");
			assert.strictEqual(this._oDSC._SCVisible, false, "Side content is not visible.");

			// M breakpoint
			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_12, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_12, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_8, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_4, false, assert);

			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveS, true, false, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.AlwaysShow, true, false, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.NeverShow, false, false, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveL, false, false, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveM, false, false, assert);

			// L breakpoint
			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_8, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_4, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_8, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_4, false, assert);

			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveS, true, false, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveM, true, false, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.AlwaysShow, true, false, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveL, false, false, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.NeverShow, false, false, assert);

			// XL breakpoint
			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_9, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_3, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_9, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_3, false, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_9, false, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_3, false, assert);

			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.NeverShow, false, false, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.AlwaysShow, true, false, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveL, true, false, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveM, true, false, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveS, true, false, assert);

			// EqualSplit mode S breakpoint

			this.assertOnContentSpanSize("Main", "_iMcSpan", S, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_12, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", S, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_12, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", S, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_12, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", S, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_12, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", S, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", S, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_12, true, assert);

			// EqualSplit mode other than S
			this.assertOnSideContentVisibility(S, sap.ui.layout.SideContentVisibility.NeverShow, false, true, assert);
			this.assertOnSideContentVisibility(S, sap.ui.layout.SideContentVisibility.AlwaysShow, false, true, assert);
			this.assertOnSideContentVisibility(S, sap.ui.layout.SideContentVisibility.ShowAboveL, false, true, assert);
			this.assertOnSideContentVisibility(S, sap.ui.layout.SideContentVisibility.ShowAboveM, false, true, assert);
			this.assertOnSideContentVisibility(S, sap.ui.layout.SideContentVisibility.ShowAboveS, false, true, assert);

			assert.throws(function () {
				this._oDSC._setResizeData("invalid breakpoint", false);
			}, INVALID_BREAKPOINT_ERROR_MSG);

			// EqualSplit mode other than S
			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", M, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", M, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", L, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", L, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowL, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowM, SPAN_SIZE_6, true, assert);

			this.assertOnContentSpanSize("Main", "_iMcSpan", XL, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);
			this.assertOnContentSpanSize("Side", "_iScSpan", XL, sap.ui.layout.SideContentFallDown.BelowXL, SPAN_SIZE_6, true, assert);

			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.NeverShow, true, true, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.AlwaysShow, true, true, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveL, true, true, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveM, true, true, assert);
			this.assertOnSideContentVisibility(M, sap.ui.layout.SideContentVisibility.ShowAboveS, true, true, assert);

			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.NeverShow, true, true, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.AlwaysShow, true, true, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveL, true, true, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveM, true, true, assert);
			this.assertOnSideContentVisibility(L, sap.ui.layout.SideContentVisibility.ShowAboveS, true, true, assert);

			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.NeverShow, true, true, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.AlwaysShow, true, true, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveL, true, true, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveM, true, true, assert);
			this.assertOnSideContentVisibility(XL, sap.ui.layout.SideContentVisibility.ShowAboveS, true, true, assert);

			this.assertOnMainContentVisibility(M, true, true, assert);
			this.assertOnMainContentVisibility(L, true, true, assert);
			this.assertOnMainContentVisibility(XL, true, true, assert);
		});

		QUnit.test("Grid state",function(assert) {
			var SC_GRID_CELL_SELECTOR = "SCGridCell",
				MC_GRID_CELL_SELECTOR = "MCGridCell",
				HIDDEN_CLASS = "sapUiHidden",
				SPAN_SIZE_12_CLASS = "sapUiDSCSpan12",
				$sideContent = this._oDSC.$(SC_GRID_CELL_SELECTOR),
				$mainContent = this._oDSC.$(MC_GRID_CELL_SELECTOR);

			// both main and side content are visible
			this._oDSC._SCVisible = true;
			this._oDSC._MCVisible = true;

			$mainContent.addClass("test1 test2");
			$sideContent.addClass("test1 test2");

			this._oDSC._changeGridState();

			assert.ok(!$mainContent.hasClass("test1"), "Main content should not have 'test1' class");
			assert.ok(!$mainContent.hasClass("test2"), "Main content should not have 'test2' class");

			assert.ok(!$sideContent.hasClass("test1"), "Side content should not have 'test1' class");
			assert.ok(!$sideContent.hasClass("test2"), "Side content should not have 'test2' class");

			assert.ok($mainContent.hasClass("sapUiDSCSpan" + this._oDSC._iMcSpan), "Main content has class 'sapUiDSCSpan" + this._oDSC._iMcSpan + "' if both main and side content are visible");
			assert.ok($sideContent.hasClass("sapUiDSCSpan" + this._oDSC._iScSpan), "Side content has class 'sapUiDSCSpan" + this._oDSC._iScSpan + "' if both main and side content are visible");

			// both main and side content are hidden
			this._oDSC._SCVisible = false;
			this._oDSC._MCVisible = false;

			this._oDSC._changeGridState();

			assert.ok($mainContent.hasClass(HIDDEN_CLASS), "Main content has class '" + HIDDEN_CLASS + "' if both main and side content are hidden");
			assert.ok($sideContent.hasClass(HIDDEN_CLASS), "Side content has class '" + HIDDEN_CLASS + "' if both main and side content are hidden");

			// only main content is visible
			this._oDSC._SCVisible = false;
			this._oDSC._MCVisible = true;

			$mainContent.addClass("test1 test2");

			this._oDSC._changeGridState();

			assert.ok(!$mainContent.hasClass("test1"), "Main content should not have 'test1' class");
			assert.ok(!$mainContent.hasClass("test2"), "Main content should not have 'test2' class");

			assert.ok($mainContent.hasClass(SPAN_SIZE_12_CLASS), "Main content has class '" + SPAN_SIZE_12_CLASS + "' if only main content is visible");
			assert.ok($sideContent.hasClass(HIDDEN_CLASS), "Side content has class '" + HIDDEN_CLASS + "' if side content is hidden");

			// only side content is visible
			this._oDSC._SCVisible = true;
			this._oDSC._MCVisible = false;

			$sideContent.addClass("test1 test2");

			this._oDSC._changeGridState();

			assert.ok(!$sideContent.hasClass("test1"), "Side content should not have 'test1' class");
			assert.ok(!$sideContent.hasClass("test2"), "Side content should not have 'test2' class");

			assert.ok($mainContent.hasClass(HIDDEN_CLASS), "Main content has class '" + HIDDEN_CLASS + "' if side content is hidden");
			assert.ok($sideContent.hasClass(SPAN_SIZE_12_CLASS), "Side content has class '" + SPAN_SIZE_12_CLASS + "' if only side content is visible");

			this._oDSC._SCVisible = true;
			this._oDSC._MCVisible = true;
			this._oDSC.setSideContentFallDown(sap.ui.layout.SideContentFallDown.BelowM);
			this._oDSC._bFixedSideContent = true;

			this._oDSC._changeGridState();

			assert.ok($mainContent.hasClass(MC_FIXED_CLASS), "Main content has class '" + MC_FIXED_CLASS + "' if side content is fixed size");
			assert.ok($sideContent.hasClass(SC_FIXED_CLASS), "Side content has class '" + SC_FIXED_CLASS + "' if main content is fixed size");

		});

		QUnit.test("Check if height should be set",function(assert) {
			this._oDSC._iScSpan = SPAN_SIZE_6;
			this._oDSC._iMcSpan = SPAN_SIZE_6;
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = true;
			assert.ok(this._oDSC._shouldSetHeight(), "Height should be set if MCSpan and SCSPan equal 12 spans and both main and side content are visible.");

			this._oDSC._iScSpan = SPAN_SIZE_3;
			this._oDSC._iMcSpan = SPAN_SIZE_6;
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = true;
			assert.ok(!this._oDSC._shouldSetHeight(), "Height should not be set if MCSpan and SCSPan do not equal 12 spans.");

			this._oDSC._iScSpan = SPAN_SIZE_6;
			this._oDSC._iMcSpan = SPAN_SIZE_6;
			this._oDSC._MCVisible = false;
			this._oDSC._SCVisible = true;
			assert.ok(this._oDSC._shouldSetHeight(), "Height should be set if either main or side is visible.");

			this._oDSC._iScSpan = SPAN_SIZE_6;
			this._oDSC._iMcSpan = SPAN_SIZE_6;
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = false;
			assert.ok(this._oDSC._shouldSetHeight(), "Height should be set if either main or side is visible.");

			this._oDSC._bFixedSideContent = true;
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = true;
			assert.ok(this._oDSC._shouldSetHeight(), "Height should be set if fixed side content is set.");

			this._oDSC.setSideContentVisibility(sap.ui.layout.SideContentVisibility.NeverShow);
			this._oDSC._MCVisible = true;
			this._oDSC._SCVisible = true;
			assert.ok(this._oDSC._shouldSetHeight(), "Height should be set if side content and main content visible " +
					"but side content visibility is set to NeverShow.");
		});

		QUnit.test("Set main and side content span sizes",function(assert) {
			this._oDSC._setSpanSize(SPAN_SIZE_3, SPAN_SIZE_9);

			assert.strictEqual(this._oDSC._iMcSpan, SPAN_SIZE_9, "Main content span size should be equal to " + SPAN_SIZE_9);
			assert.strictEqual(this._oDSC._iScSpan, SPAN_SIZE_3, "Side content span size should be equal to " + SPAN_SIZE_3);
		});

		QUnit.module("Content Query", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent({
					containerQuery: true
				});
				sinon.spy(this._oDSC, "_adjustToScreenSize");
				$("#qunit-fixture").width(960);
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				$("#qunit-fixture").width(1000); // Reset qunit fixture size to original (1000px);
				this._oDSC._adjustToScreenSize.restore();
				this._oDSC.destroy();
				this._oDSC = null;
			}
		});

		QUnit.test("On init with contentQuery _adjustToScreenSize method should be called", function (assert) {
			assert.ok(this._oDSC._adjustToScreenSize.calledOnce, "The resize event handler is fired once initially");
			assert.strictEqual(this._oDSC.getCurrentBreakpoint(), M, "The current breakpoint in this setup should be 'M'");
		});

		QUnit.module("Construction / Destruction", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent();
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC = null;
			}
		});

		QUnit.test("Dynamic side content is created",function(assert) {
			assert.strictEqual(this._oDSC.$().length, 1, "Dynamic side content is created in the dom.");
		});

		QUnit.test("Current breakpoint is set",function(assert) {
			assert.ok(this._oDSC.getCurrentBreakpoint(), "The current breakpoint of the page is set");
		});

		QUnit.test("Calculate the size of the main and side content according to the current breakpoint",function(assert) {
			sinon.spy(this._oDSC, "_setResizeData");

			assert.ok(!this._oDSC._setResizeData.calledOnce, "The size of the main and side content are set");

			this._oDSC._setResizeData.restore();
		});

		QUnit.test("Main content and Side content sliders are initialized",function(assert) {
			assert.ok(this._oDSC._oMCScroller, "Main content slider is set");
			assert.ok(this._oDSC._oSCScroller, "Side content slider is set");
		});

		QUnit.test("dispose",function(assert) {
			this._oDSC.destroy();
			this._oDSC.setContainerQuery(true);

			assert.strictEqual(this._oDSC._oSCScroller, null, "Side content scroller is null");
			assert.strictEqual(this._oDSC._oMCScroller, null, "Main content scroller is null");
		});

		QUnit.module("Interaction", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent();
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC.destroy();
				this._oDSC = null;
			}
		});

		QUnit.test("setShowSideContent consistent visibility on breakpoint change and toggling",function(assert) {
			this._oDSC._currentBreakpoint = XL;
			this._oDSC.setShowSideContent(false);

			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be hidden");

			this._oDSC._currentBreakpoint = L;
			this._oDSC._changeGridState();
			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be hidden when changing to L breakpoint");

			this._oDSC._currentBreakpoint = M;
			this._oDSC._changeGridState();
			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be hidden when changing to M breakpoint");

			this._oDSC._currentBreakpoint = S;
			this._oDSC._changeGridState();
			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be hidden when changing to S breakpoint");

			this._oDSC._currentBreakpoint = M;
			this._oDSC._changeGridState();
			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be hidden after switching to M breakpoint");

			this._oDSC._currentBreakpoint = S;
			this._oDSC._changeGridState();
			this._oDSC.toggle();
			assert.ok(this._oDSC.isSideContentVisible(), "Side content should be now visible when changing to S breakpoint and toggling");
			assert.ok(!this._oDSC.isMainContentVisible(), "Main content should be now hidden when changing to S breakpoint and toggling");

			this._oDSC._currentBreakpoint = M;
			this._oDSC._changeGridState();
			assert.ok(this._oDSC.isSideContentVisible(), "Side content should be now visible after switching to M breakpoint after toggling on S breakpoint");

			this._oDSC._currentBreakpoint = S;
			this._oDSC._changeGridState();
			this._oDSC.toggle();
			this._oDSC.setShowSideContent(false);
			assert.ok(!this._oDSC.isSideContentVisible(), "Side content should be now hidden when changing to S breakpoint, toggling and closing the side content");
			assert.ok(this._oDSC.isMainContentVisible(), "Main content should be now visible when changing to S breakpoint, toggling and closing the side content");

		});

		QUnit.module("Listeners", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent({containerQuery: true});
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC = null;
			}
		});

		QUnit.test("Listeners are created / removed",function(assert) {
			assert.notStrictEqual(this._oDSC._sContainerResizeListener, undefined, "Container resize listener is registered if there is container query");
			this._oDSC.destroy();
			assert.strictEqual(this._oDSC._sContainerResizeListener, null, "Container resize listener is null if there is container query");
		});

		QUnit.module("Screen reader", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent({containerQuery: true});
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC = null;
			}
		});

		QUnit.test("Side Content has correct aria attributes",function(assert) {
			var sSideContentTag = Device.browser.firefox ? "div" : "aside",
					$sideContent = $("#" + this._oDSC.getId() + "-SCGridCell"),
			//$sideContent = this.oDSC.$().find("> aside"),
					oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout");

			assert.strictEqual($sideContent.length, 1, "Side Content has correct " + sSideContentTag + " tag");
			assert.strictEqual($sideContent.attr("role"), "complementary", "Side Content has correct role 'complementary'");
			assert.strictEqual($sideContent.attr("aria-label"), oMessageBundle.getText(SIDE_CONTENT_LABEL), "Side Content has correct 'aria-role' " + oMessageBundle.getText(SIDE_CONTENT_LABEL));
		});

		QUnit.module("Invalidation", {
			beforeEach : function () {
				this._oDSC = new DynamicSideContent({showSideContent: false, containerQuery: true});
				this._oDSC.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			afterEach : function () {
				this._oDSC = null;
			}
		});

		QUnit.test("Side Content invisible after invalidation",function(assert) {
			var SC_GRID_CELL_SELECTOR = "SCGridCell",
				HIDDEN_CLASS = "sapUiHidden";

			this._oDSC.invalidate();
			sap.ui.getCore().applyChanges();

			assert.ok(this._oDSC.$(SC_GRID_CELL_SELECTOR).hasClass(HIDDEN_CLASS), "Side content in invisible");
		});

	})(jQuery);
});