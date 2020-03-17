import Mail from '../../lib/Mail';

class NewOrderMail {
    get key() {
        return 'NewOrderMail';
    }

    async handle({ data }) {
        const { order } = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${order.deliveryman.nome}<${order.deliveryman.email}`,
            subject: 'Nova encomenda disponível',
            template: 'newOrder',
            context: {
                deliveryman_name: order.deliveryman.nome,
                client_product: order.product,
                order_id: order.id,
            },
        });
    }
}

export default new NewOrderMail();
