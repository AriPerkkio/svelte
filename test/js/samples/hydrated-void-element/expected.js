/* generated by Svelte vX.Y.Z */
import {
	SvelteComponent,
	attr,
	children,
	claim_element,
	claim_space,
	detach,
	element,
	init,
	insert_hydration,
	noop,
	safe_not_equal,
	space,
	src_url_equal
} from "svelte/internal";

function create_fragment(ctx) {
	let img;
	let img_src_value;
	let t;
	let div;

	return {
		c() {
			img = element("img");
			t = space();
			div = element("div");
			this.h();
		},
		l(nodes) {
			img = claim_element(nodes, "IMG", { src: true, alt: true });
			t = claim_space(nodes);
			div = claim_element(nodes, "DIV", {});
			children(div).forEach(detach);
			this.h();
		},
		h() {
			if (!src_url_equal(img.src, img_src_value = "donuts.jpg")) attr(img, "src", img_src_value);
			attr(img, "alt", "donuts");
		},
		m(target, anchor) {
			insert_hydration(target, img, anchor);
			insert_hydration(target, t, anchor);
			insert_hydration(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(img);
			if (detaching) detach(t);
			if (detaching) detach(div);
		}
	};
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment, safe_not_equal, {});
	}
}

export default Component;