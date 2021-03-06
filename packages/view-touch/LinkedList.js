import SingleNode from './SingleNode'

/**
 * 单向链表的实现
 */
class LinkedList {
    constructor() {
        this._head = new SingleNode('This is head node')
        this._size = 0
    }

    isEmpty() {
        return this._size === 0
    }

    size() {
        console.log('linkedList.size:', this._size)
        return this._size
    }

    getHead() {
        return this._head
    }

    display() {
        let currNode = this.getHead().next
        while (currNode) {
            console.log(currNode.element)
            currNode = currNode.next
        }
    }

    find(item) {
        if (item === null) {
            return null
        }
        let currNode = this.getHead()
        while (currNode && currNode.element !== item) {
            currNode = currNode.next
        }
        return currNode
    }

    findPre(item) {
        let currNode = this.getHead()
        while (currNode.next !== null && currNode.next.element !== item) {
            currNode = currNode.next
        }
        return currNode
    }

    findLast() {
        let currNode = this.getHead()
        while (currNode.next) {
            currNode = currNode.next
        }
        return currNode
    }

    remove(item) {
        if (item) {
            const preNode = this.findPre(item)
            if (preNode === null) {
                return
            }
            if (preNode.next !== null) {
                preNode.next = preNode.next.next
                this._size -= 1
            }
        }
    }

    /**
   * 在item之后插入newElement
   * @param newElement
   * @param item
   */
    insert(newElement, item) {
        const newNode = new SingleNode(newElement)
        const finder = item ? this.find(item) : null
        if (finder) {
            newNode.next = finder.next
            finder.next = newNode
        } else {
            const last = this.findLast()
            last.next = newNode
        }
        this._size += 1
    }

    add(item) {
        this.insert(item)
    }
}

export default LinkedList
