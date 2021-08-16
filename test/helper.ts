import * as mocha from 'mocha'

export class ITElement {
  readonly title: string
  readonly fn?: mocha.Func
  constructor (title: string, fn?: mocha.Func) {
    this.title = title
    this.fn = fn
  }
}

export class SingleGroup {
  readonly name: string
  readonly elements: ITElement[]
  constructor (name: string, ...elements: ITElement[]) {
    this.name = name
    this.elements = elements
  }

  add (element: ITElement): SingleGroup {
    this.elements.push(element)
    return this
  }
}

export class MultiGroup {
  readonly name: string
  readonly elements: (MultiGroup | SingleGroup | ITElement)[]
  constructor (name: string, ...elements: (MultiGroup | SingleGroup | ITElement)[]) {
    this.name = name
    this.elements = elements
  }

  add (elements: (MultiGroup | SingleGroup | ITElement)[]): MultiGroup {
    this.elements.push(...elements)
    return this
  }
}

export class GroupedIT {
  static single (group: SingleGroup): void {
    describe('[' + group.name + ']', () => {
      group.elements.forEach((element, i, elements) => {
        it('[' + (i + 1) + '/' + elements.length + '] ' + element.title, element.fn)
      })
    })
  }

  static multi (groups: MultiGroup): void {
    describe('[' + groups.name + ']', () => {
      groups.elements.forEach((group: MultiGroup | SingleGroup | ITElement) => {
        if (group instanceof MultiGroup) {
          this.multi(group)
        } else if (group instanceof SingleGroup) {
          this.single(group)
        } else {
          it(group.title, group.fn)
        }
      })
    })
  }
}
