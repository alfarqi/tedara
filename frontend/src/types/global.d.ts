declare global {
  interface Window {
    $: any;
  }
  const $: any;
  
  interface JQuery {
    summernote: any;
  }
  
  interface JQueryStatic {
    fn: {
      summernote: any;
    };
  }
}

export {};
