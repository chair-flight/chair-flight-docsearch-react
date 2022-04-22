var _excluded = ["footer", "searchBox"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import { createAutocomplete } from '@algolia/autocomplete-core';
import React from 'react';
import { MAX_QUERY_SIZE } from './constants';
import { Footer } from './Footer';
import { Hit } from './Hit';
import { ScreenState } from './ScreenState';
import { SearchBox } from './SearchBox';
import { createStoredSearches } from './stored-searches';
import { useTouchEvents } from './useTouchEvents';
import { useTrapFocus } from './useTrapFocus';
import { identity, noop } from './utils';
export function DocSearchModal(_ref) {
  var indexName = _ref.indexName,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? 'Search docs' : _ref$placeholder,
      searchParameters = _ref.searchParameters,
      _ref$onClose = _ref.onClose,
      onClose = _ref$onClose === void 0 ? noop : _ref$onClose,
      _ref$transformItems = _ref.transformItems,
      transformItems = _ref$transformItems === void 0 ? identity : _ref$transformItems,
      _ref$hitComponent = _ref.hitComponent,
      hitComponent = _ref$hitComponent === void 0 ? Hit : _ref$hitComponent,
      _ref$resultsFooterCom = _ref.resultsFooterComponent,
      resultsFooterComponent = _ref$resultsFooterCom === void 0 ? function () {
    return null;
  } : _ref$resultsFooterCom,
      navigator = _ref.navigator,
      _ref$initialScrollY = _ref.initialScrollY,
      initialScrollY = _ref$initialScrollY === void 0 ? 0 : _ref$initialScrollY,
      _ref$disableUserPerso = _ref.disableUserPersonalization,
      disableUserPersonalization = _ref$disableUserPerso === void 0 ? false : _ref$disableUserPerso,
      _ref$initialQuery = _ref.initialQuery,
      initialQueryFromProp = _ref$initialQuery === void 0 ? '' : _ref$initialQuery,
      _ref$translations = _ref.translations,
      translations = _ref$translations === void 0 ? {} : _ref$translations,
      getMissingResultsUrl = _ref.getMissingResultsUrl,
      search = _ref.search;

  var footerTranslations = translations.footer,
      searchBoxTranslations = translations.searchBox,
      screenStateTranslations = _objectWithoutProperties(translations, _excluded);

  var _React$useState = React.useState({
    query: '',
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    activeItemId: null,
    status: 'idle'
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var containerRef = React.useRef(null);
  var modalRef = React.useRef(null);
  var formElementRef = React.useRef(null);
  var dropdownRef = React.useRef(null);
  var inputRef = React.useRef(null);
  var snippetLength = React.useRef(10);
  var initialQueryFromSelection = React.useRef(typeof window !== 'undefined' ? window.getSelection().toString().slice(0, MAX_QUERY_SIZE) : '').current;
  var initialQuery = React.useRef(initialQueryFromProp || initialQueryFromSelection).current;
  var favoriteSearches = React.useRef(createStoredSearches({
    key: "__DOCSEARCH_FAVORITE_SEARCHES__".concat(indexName),
    limit: 10
  })).current;
  var recentSearches = React.useRef(createStoredSearches({
    key: "__DOCSEARCH_RECENT_SEARCHES__".concat(indexName),
    // We display 7 recent searches and there's no favorites, but only
    // 4 when there are favorites.
    limit: favoriteSearches.getAll().length === 0 ? 7 : 4
  })).current;
  var saveRecentSearch = React.useCallback(function saveRecentSearch(item) {
    if (disableUserPersonalization) {
      return;
    } // We don't store `content` record, but their parent if available.


    var search = item.type === 'content' ? item.__docsearch_parent : item; // We save the recent search only if it's not favorited.

    if (search && favoriteSearches.getAll().findIndex(function (x) {
      return x.objectID === search.objectID;
    }) === -1) {
      recentSearches.add(search);
    }
  }, [favoriteSearches, recentSearches, disableUserPersonalization]);
  var autocomplete = React.useMemo(function () {
    return createAutocomplete({
      id: 'docsearch',
      defaultActiveItemId: 0,
      placeholder: placeholder,
      openOnFocus: true,
      initialState: {
        query: initialQuery,
        context: {
          searchSuggestions: []
        }
      },
      navigator: navigator,
      onStateChange: function onStateChange(props) {
        setState(props.state);
      },
      getSources: function () {
        var _getSources = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
          var query, results;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  query = _ref2.query;

                  if (query) {
                    _context.next = 5;
                    break;
                  }

                  if (!disableUserPersonalization) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt("return", []);

                case 4:
                  return _context.abrupt("return", [{
                    sourceId: 'recentSearches',
                    onSelect: function onSelect(_ref3) {
                      var item = _ref3.item,
                          event = _ref3.event;
                      saveRecentSearch(item);

                      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                        onClose();
                      }
                    },
                    getItemUrl: function getItemUrl(_ref4) {
                      var item = _ref4.item;
                      return item.url;
                    },
                    getItems: function getItems() {
                      return recentSearches.getAll();
                    }
                  }, {
                    sourceId: 'favoriteSearches',
                    onSelect: function onSelect(_ref5) {
                      var item = _ref5.item,
                          event = _ref5.event;
                      saveRecentSearch(item);

                      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                        onClose();
                      }
                    },
                    getItemUrl: function getItemUrl(_ref6) {
                      var item = _ref6.item;
                      return item.url;
                    },
                    getItems: function getItems() {
                      return favoriteSearches.getAll();
                    }
                  }]);

                case 5:
                  _context.next = 7;
                  return search(query);

                case 7:
                  results = _context.sent;
                  return _context.abrupt("return", results.map(function (_, index) {
                    return {
                      sourceId: "hits".concat(index),
                      onSelect: function onSelect(_ref7) {
                        var item = _ref7.item,
                            event = _ref7.event;
                        saveRecentSearch(item);

                        if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                          onClose();
                        }
                      },
                      getItemUrl: function getItemUrl(_ref8) {
                        var item = _ref8.item;
                        return item.url;
                      },
                      getItems: function getItems() {
                        return transformItems(results);
                      }
                    };
                  }));

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function getSources(_x) {
          return _getSources.apply(this, arguments);
        }

        return getSources;
      }()
    });
  }, [indexName, searchParameters, onClose, recentSearches, favoriteSearches, saveRecentSearch, initialQuery, placeholder, navigator, transformItems, disableUserPersonalization]);
  var getEnvironmentProps = autocomplete.getEnvironmentProps,
      getRootProps = autocomplete.getRootProps,
      refresh = autocomplete.refresh;
  useTouchEvents({
    getEnvironmentProps: getEnvironmentProps,
    panelElement: dropdownRef.current,
    formElement: formElementRef.current,
    inputElement: inputRef.current
  });
  useTrapFocus({
    container: containerRef.current
  });
  React.useEffect(function () {
    document.body.classList.add('DocSearch--active');
    return function () {
      var _window$scrollTo, _window;

      document.body.classList.remove('DocSearch--active'); // IE11 doesn't support `scrollTo` so we check that the method exists
      // first.

      (_window$scrollTo = (_window = window).scrollTo) === null || _window$scrollTo === void 0 ? void 0 : _window$scrollTo.call(_window, 0, initialScrollY);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(function () {
    var isMobileMediaQuery = window.matchMedia('(max-width: 750px)');

    if (isMobileMediaQuery.matches) {
      snippetLength.current = 5;
    }
  }, []);
  React.useEffect(function () {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [state.query]); // We don't focus the input when there's an initial query (i.e. Selection
  // Search) because users rather want to see the results directly, without the
  // keyboard appearing.
  // We therefore need to refresh the autocomplete instance to load all the
  // results, which is usually triggered on focus.

  React.useEffect(function () {
    if (initialQuery.length > 0) {
      refresh();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialQuery, refresh]); // We rely on a CSS property to set the modal height to the full viewport height
  // because all mobile browsers don't compute their height the same way.
  // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

  React.useEffect(function () {
    function setFullViewportHeight() {
      if (modalRef.current) {
        var vh = window.innerHeight * 0.01;
        modalRef.current.style.setProperty('--docsearch-vh', "".concat(vh, "px"));
      }
    }

    setFullViewportHeight();
    window.addEventListener('resize', setFullViewportHeight);
    return function () {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: containerRef
  }, getRootProps({
    'aria-expanded': true
  }), {
    className: ['DocSearch', 'DocSearch-Container', state.status === 'stalled' && 'DocSearch-Container--Stalled', state.status === 'error' && 'DocSearch-Container--Errored'].filter(Boolean).join(' '),
    role: "button",
    tabIndex: 0,
    onMouseDown: function onMouseDown(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "DocSearch-Modal",
    ref: modalRef
  }, /*#__PURE__*/React.createElement("header", {
    className: "DocSearch-SearchBar",
    ref: formElementRef
  }, /*#__PURE__*/React.createElement(SearchBox, _extends({}, autocomplete, {
    state: state,
    autoFocus: initialQuery.length === 0,
    inputRef: inputRef,
    isFromSelection: Boolean(initialQuery) && initialQuery === initialQueryFromSelection,
    translations: searchBoxTranslations,
    onClose: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    className: "DocSearch-Dropdown",
    ref: dropdownRef
  }, /*#__PURE__*/React.createElement(ScreenState, _extends({}, autocomplete, {
    indexName: indexName,
    state: state,
    hitComponent: hitComponent,
    resultsFooterComponent: resultsFooterComponent,
    disableUserPersonalization: disableUserPersonalization,
    recentSearches: recentSearches,
    favoriteSearches: favoriteSearches,
    inputRef: inputRef,
    translations: screenStateTranslations,
    getMissingResultsUrl: getMissingResultsUrl,
    onItemClick: function onItemClick(item) {
      saveRecentSearch(item);
      onClose();
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "DocSearch-Footer"
  }, /*#__PURE__*/React.createElement(Footer, {
    translations: footerTranslations
  }))));
}