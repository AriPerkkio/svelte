import { b, x } from 'code-red';
import Wrapper from './Wrapper';
import Renderer from '../../Renderer';
import Block from '../../Block';
import MustacheTag from '../../../nodes/MustacheTag';
import RawMustacheTag from '../../../nodes/RawMustacheTag';
import { Node } from 'estree';

export default class Tag extends Wrapper {
	node: MustacheTag | RawMustacheTag;

	constructor(renderer: Renderer, block: Block, parent: Wrapper, node: MustacheTag | RawMustacheTag) {
		super(renderer, block, parent, node);

		this.cannot_use_innerhtml();
		if (!this.is_dependencies_static()) {
			this.not_static_content();
		}

		block.add_dependencies(node.expression.dependencies);
	}

	is_dependencies_static() {
		return this.node.expression.contextual_dependencies.size === 0 && this.node.expression.dynamic_dependencies().length === 0;
	}

	rename_this_method(
		block: Block,
		update: ((value: Node) => (Node | Node[]))
	) {
		const dependencies = this.node.expression.dynamic_dependencies();
		let snippet = this.node.expression.manipulate(block);

		const value = this.node.should_cache && block.get_unique_name(`${this.var.name}_value`);
		const content = this.node.should_cache ? value : snippet;

		snippet = x`${snippet} + ""`;

		if (this.node.should_cache) block.add_variable(value, snippet); // TODO may need to coerce snippet to string

		if (dependencies.length > 0) {
			let condition = block.renderer.dirty(dependencies);

			if (block.has_outros) {
				condition = x`!#current || ${condition}`;
			}

			if (this.node.should_cache) {
				const updatedValue = block.get_unique_name(`${this.var.name}_value_updated`);

				block.chunks.update.push(b`
					if (${condition}) {
						const ${updatedValue} = ${snippet}
						if(${value} !== ${updatedValue}) {
							${value} = ${updatedValue}
							${update(content as Node)}
						}
					}`
				);
			} else {
				block.chunks.update.push(b`if (${condition}) ${update(content as Node)}`);
			}

		}

		return { init: content };
	}
}
