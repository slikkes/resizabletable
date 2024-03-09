const tableResizer = {
    root: null,
    showTransition: true,
    className: 'resizable-table',
    resize: {
        idx: {
            left: null,
            right: null,
        },
        startX: null,
        startWidth: {
            left: null,
            right: null,
        },
        newWidth: {
            left: null,
            right: null,
        }
    },
    init() {
        this.root = document.querySelector(`.${this.className}`);
        this.createDragButtons()
        this.addCSS()
    },
    createDragButtons() {
        const trs = this.root.querySelectorAll("thead tr")
        if (trs.length === 0) {
            throw new Error("header row not found")
        }

        const ths = trs[0].querySelectorAll("th,td")
        if (ths.length === 0) {
            throw new Error("header cells not found")
        }

        // exist?

        let totalWidth = 0;
        for (const [i, th] of ths.entries()) {

            //const width = th.offsetWidth;
            const width = parseInt(getComputedStyle(th).getPropertyValue('width').replace("px", ""))
            const key = `--res-col-${i}`

            this._setColWidth(key, width)

            th.style.removeProperty('width')
            th.style.removeProperty('min-width')
            th.style.width = `var(${key})`
            th.style.position = 'relative'
            th.style.overflow = 'visible'

            const div = document.createElement('div')
            div.style.overflow = 'hidden'
            div.style.textOverflow = 'ellipsis'
            div.innerHTML = th.innerHTML;
            th.innerHTML = null;
            th.append(div);

            if (i < ths.length - 1) {
                const button = this._createResizeBtn(i)
                th.append(button)
            }

            totalWidth += width;
        }

        const colgroup = this.root.querySelector("colgroup")
        if (colgroup) {
            colgroup.remove()
        }

        const bodyRows = this.root.querySelectorAll('tbody tr');
        for (const row of bodyRows.values()) {
            const cells = row.querySelectorAll('td')
            for (const [i, cell] of cells.entries()) {
                const key = `--res-col-${i}`
                cell.style.removeProperty('width')
                cell.style.removeProperty('min-width')

                cell.style.width = `var(${key})`;
                cell.style.overflow = `hidden`;
                cell.style.textOverflow = `ellipsis`;
                cell.style.minWidth = '0';

            }
        }
        const filterRowCells = this.root.querySelectorAll('tr#tableFilter td');
        for (const [i, cell] of filterRowCells.entries()) {
            const key = `--res-col-${i}`
            cell.style.width = `var(${key})`;
            const filter = cell.querySelector(".tableFilter_form-group")
            if (filter) {
                filter.style.width = `var(${key})`;
            }
        }


        this.root.style.width = `${totalWidth}px`;
    },
    _setColWidth(key, width) {
        this.root.style.setProperty(key, `${width}px`);
    },
    _createResizeBtn(idx) {
        const btn = document.createElement("button");

        btn.classList.add("resize-btn");
        btn.dataset.idx = idx;
        btn.draggable = true;
        btn.ondragstart = ev => this._startResize(ev);
        btn.ondrag = ev => this._handleDrag(ev);
        btn.ondragend = () => this._resetResizer();

        return btn;
    },

    _startResize(ev) {
        this.resize.idx.left = parseInt(ev.target.dataset.idx);
        this.resize.idx.right = parseInt(ev.target.dataset.idx) + 1;
        //maxidx?
        this.resize.startX = ev.pageX;
        this.resize.startWidth.left = parseInt(getComputedStyle(ev.target.parentElement).getPropertyValue('width').replace("px", ""))

        const rightBtn = this.root.querySelectorAll('thead th,td')[this.resize.idx.right]
        this.resize.startWidth.right = parseInt(getComputedStyle(rightBtn).getPropertyValue('width').replace("px", ""))
    },
    _handleDrag(ev) {
        if (ev.pageX === 0) {
            return;
        }
        const movement = ev.pageX - this.resize.startX
        const newWidthL = this.resize.startWidth.left + movement;
        const newWidthR = this.resize.startWidth.right - movement;

        if (newWidthR < 0 || newWidthL < 0) {
            return;
        }

        this.resize.newWidth.left = newWidthL
        this.resize.newWidth.right = newWidthR

        if (this.showTransition) {
            setTimeout(() => {
                this._setColWidth(`--res-col-${this.resize.idx.left}`, this.resize.newWidth.left)
                this._setColWidth(`--res-col-${this.resize.idx.right}`, this.resize.newWidth.right)
            }, 100)

        }

    },
    _resetResizer() {
        if (!this.showTransition) {

            this._setColWidth(`--res-col-${this.resize.idx.left}`, this.resize.newWidth.left)
            this._setColWidth(`--res-col-${this.resize.idx.right}`, this.resize.newWidth.right)
        }
        this._setColWidth(`--res-col-${this.resize.idx.left}`, this.resize.newWidth.left)
        this._setColWidth(`--res-col-${this.resize.idx.right}`, this.resize.newWidth.right)

        this.resize = {
            idx: {
                left: null,
                right: null,
            },
            startX: null,
            startWidth: {
                left: null,
                right: null,
            },
            newWidth: {
                left: null,
                right: null,
            }
        }
    },
    addCSS() {
        let css = `.resizable-table .resize-btn{padding:2px 1px;cursor:col-resize;position:absolute;right:-6px;top:6px;z-index:3;border:0;background-color:#018282} .resizable-table .resize-btn:active,.resizable-table .resize-btn:hover{background-color:#046767} .resizable-table .resize-btn:after{content:'::' !important;} .resizable-table .resize-btn:active{cursor:col-resize}`;
        if (this.className !== 'resizable-table') {
            css = css.replaceAll('resizable-table', this.className)
        }

        let style = document.createElement("style")
        style.innerHTML = css;
        document.head.append(style)
    }
}
